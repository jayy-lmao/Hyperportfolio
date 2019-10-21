from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import views
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import json
import os
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry
from stocks_django import settings
import datetime

host = settings.FIN_API_BASE_URL
rapid_key = os.environ.get('RAPID_API_KEY')

# timeout settings in seconds: the following result in 2 hours
quick_api_timeout = 60 * 60 * 2
long_api_timeout = 60 * 60 * 2


def requests_retry_session(
    retries=5,
    backoff_factor=0.2,
    status_forcelist=(500, 502, 504),
    session=None,
):
    """
    Function to make HTTP requests based on retries, backoff
    and status list. Credit is given to 'Best practice with
    retries with requests' at:
    https://www.peterbe.com/plog/best-practice-with-retries-with-requests
    """
    session = session or requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session


class MarketSummaryView(views.APIView):
    """
    Django class to establish a read only view for MarketSummary
    information from the RAPID API Yahoo Finance api call to the
    original endpoint `market/get-summary`.
    """
    permission_classes = (AllowAny,)  # Allow anyone to use this view

    @method_decorator(cache_page(quick_api_timeout))
    # decorator sets the cache time length
    def get(self, *args, **kwargs):
        """
        Method to make the request to the RAPID API endpoint for
        Market Summary information.
        Gets the region and language by query parameters.
        """
        region = self.request.query_params.get('region', None)
        lang = self.request.query_params.get('lang', None)
        response = requests_retry_session().get(
            'https://{}/market/get-summary?region={}&lang={}'.format(
                host, region, lang), headers={
                "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                "X-RapidAPI-Key": rapid_key})

        parsed_response = json.loads(response.text)
        print(parsed_response)

        # If the code is not 200 and the response is empty or has incorrect
        # Content, the call should be remade.
        while (
            response.status_code != 200 and parsed_response is None or
            parsed_response.get('marketSummaryResponse') is None or
            parsed_response.get('marketSummaryResponse')
                .get('result') is None):
            response = requests_retry_session().get(
                'https://{}/market/get-summary?region={}&lang={}'
                .format(host, region, lang), headers={
                    "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                    "X-RapidAPI-Key": rapid_key})
            parsed_response = json.loads(response.text)
        return Response(json.loads(response.text))


class InstrumentSearchView(views.APIView):
    """
    Django class to establish a read only view for the instrument
    search from the RAPID API Yahoo Finance api call to the
    original endpoint `market/auto-complete`.
    """
    permission_classes = (AllowAny,)  # Allow anyone to use this view

    @method_decorator(cache_page(long_api_timeout))
    def get(self, *args, **kwargs):
        """
        Method to make the request to the RAPID API endpoint for
        Instrument Search results.
        Gets the region, language and query string by query parameters.
        """
        print(str(datetime.datetime.now()))
        region = self.request.query_params.get('region', None)
        lang = self.request.query_params.get('lang', None)
        query = self.request.query_params.get('query', None)
        response = requests_retry_session().get(
            'https://{}/market/auto-complete?region={}&lang={}&query={}'
            .format(host, region, lang, query), headers={
                "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                "X-RapidAPI-Key": rapid_key})
        parsed_response = json.loads(response.text)

        # If the code is not 200 and the response is empty or has incorrect
        # Content, the call should be remade.
        while (
            response.status_code != 200 and
            parsed_response.get('ResultSet')
                .get('Result') is None):
            response = requests_retry_session().get(
                'https://{}/market/auto-complete?region={}&lang={}&query={}'
                .format(host, region, lang, query), headers={
                    "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                    "X-RapidAPI-Key": rapid_key})
            parsed_response = json.loads(response.text)
        return Response(json.loads(response.text)['ResultSet']['Result'])


class InstrumentView(views.APIView):
    """
    Django class to establish a read only view for instruments
    from the RAPID API Yahoo Finance api call to the original
    endpoint `market/get-quotes`.
    """
    permission_classes = (AllowAny,)  # Allow anyone to use this view

    @method_decorator(cache_page(quick_api_timeout))
    def get(self, *args, **kwargs):
        """
        Method to make the request to the RAPID API endpoint for
        Instrument quotes results.
        Gets the symbols by URL path and passes it via query parameter.
        Gets the region and language by query parameters.
        Symbols are passed as a comma separated list of symbols.
        E.g. MSFT,AAPL
        """
        print(str(datetime.datetime.now()))
        region = self.request.query_params.get('region', None)
        lang = self.request.query_params.get('lang', None)
        symbols = self.kwargs['symbols']
        response = requests_retry_session().get(
            'https://{}/market/get-quotes?region={}&lang={}&symbols={}'.format(
                settings.FIN_API_BASE_URL,
                region,
                lang,
                symbols),
            headers={
                "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                "X-RapidAPI-Key": os.environ.get('RAPID_API_KEY')})
        parsed_response = json.loads(response.text)

        # If the code is not 200 and the response is empty or has incorrect
        # Content, the call should be remade.
        while (
            response.status_code != 200 and
            parsed_response.get('quoteResponse')
                .get('result') is None):
            response = requests_retry_session().get(
                'https://{}/market/get-quotes?region={}&lang={}&symbols={}'
                .format(
                    settings.FIN_API_BASE_URL,
                    region,
                    lang,
                    symbols),
                headers={
                    "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                    "X-RapidAPI-Key": os.environ.get('RAPID_API_KEY')})
            parsed_response = json.loads(response.text)
        return Response(json.loads(response.text))


class InstrumentChartsView(views.APIView):
    """
    Django class to establish a read only view for the instrument
    charts from the RAPID API Yahoo Finance api call to the original
    endpoint `stock/v2/get-chart`.
    """
    permission_classes = (AllowAny,)  # Allow anyone to use this view

    @method_decorator(cache_page(quick_api_timeout))
    def get(self, *args, **kwargs):
        """
        Method to make the request to the RAPID API endpoint for
        Instrument chart results.
        Gets the symbol by URL path and passes it via query parameter.
        Gets the region, interval, range and language by query parameters.
        """
        region = self.request.query_params.get('region', None)
        interval = self.request.query_params.get('interval', None)
        lang = self.request.query_params.get('lang', None)
        range = self.request.query_params.get('range', None)
        symbol = self.kwargs['symbol']
        response = requests_retry_session().get(
            'https://{}/stock/v2/get-chart?interval={}&region={}'
            '&symbol={}&lang={}&range={}'
            .format(
                host, interval, region, symbol, lang, range), headers={
                "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                "X-RapidAPI-Key": rapid_key})
        parsed_response = json.loads(response.text)

        # If the code is not 200 and the response is empty or has incorrect
        # Content, the call should be remade.
        while response.status_code != 200 and parsed_response.get(
                'chart').get('result') is None:
            response = requests_retry_session().get(
                'https://{}/stock/v2/get-chart?interval={}&region={}'
                '&symbol={}&lang={}&range={}'
                .format(
                    host, interval, region, symbol, lang, range), headers={
                    "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                    "X-RapidAPI-Key": rapid_key})
            parsed_response = json.loads(response.text)
        return Response(json.loads(response.text))


class InstrumentChartsMultiView(views.APIView):
    """
    Django class to establish a read only view for the instrument
    charts with comparisons from the RAPID API Yahoo Finance api
    call to the original endpoint `market/get-charts`.
    """
    permission_classes = (AllowAny,)  # Allow anyone to use this view

    @method_decorator(cache_page(quick_api_timeout))
    def get(self, *args, **kwargs):
        """
        Method to make the request to the RAPID API endpoint for
        Instrument chart results.
        Gets the symbol by URL path and passes it via query parameter.
        Gets the region, interval, range, language, comparisons
        by query parameters. comparisons are a comma separated
        string of symbols to compare against symbol.
        E.g. MSFT,AAPL
        """
        region = self.request.query_params.get('region', None)
        interval = self.request.query_params.get('interval', None)
        lang = self.request.query_params.get('lang', None)
        range = self.request.query_params.get('range', None)
        symbol = self.kwargs['symbol']
        comparisons = self.request.query_params.get('comparisons', None)
        response = requests_retry_session().get(
            'https://{}/market/get-charts?interval={}&region={}'
            '&symbol={}&lang={}&range={}&comparisons={}'
            .format(
                host,
                interval,
                region,
                symbol,
                lang,
                range,
                comparisons),
            headers={
                "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                "X-RapidAPI-Key": rapid_key})
        parsed_response = json.loads(response.text)

        # If the code is not 200 and the response is empty or has incorrect
        # Content, the call should be remade.
        while response.status_code != 200 and parsed_response.get(
                'chart').get('result') is None:
            response = requests_retry_session().get(
                'https://{}/market/get-charts?interval={}&region={}'
                '&symbol={}&lang={}&range={}&comparisons={}'
                .format(
                    host,
                    interval,
                    region,
                    symbol,
                    lang,
                    range,
                    comparisons),
                headers={
                    "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                    "X-RapidAPI-Key": rapid_key})
            parsed_response = json.loads(response.text)
        return Response(json.loads(response.text))


class InstrumentNewsView(views.APIView):
    """
    Django class to establish a read only view for the instrument
    news from the RAPID API Yahoo Finance api
    call to the original endpoint `stock/get-news`.
    """
    permission_classes = (AllowAny,)  # Allow anyone to use this view

    @method_decorator(cache_page(quick_api_timeout))
    def get(self, *args, **kwargs):
        """
        Method to make the request to the RAPID API endpoint for
        Instrument news results.
        Gets the region query parameters.
        Gets the symbol by URL path and passes it via query parameter.
        """
        region = self.request.query_params.get('region', None)
        symbol = self.kwargs['symbol']
        response = requests_retry_session().get(
            'https://{}/stock/get-news?region={}&category={}'
            .format(
                host, region, symbol), headers={
                "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                "X-RapidAPI-Key": rapid_key})
        parsed_response = json.loads(response.text)

        # If the code is not 200 and the response is empty or has incorrect
        # Content, the call should be remade.
        while response.status_code != 200 and parsed_response.get(
                'items') is None:
            response = requests_retry_session().get(
                'https://{}/stock/get-news?region={}&category={}'
                .format(
                    host, region, symbol), headers={
                    "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                    "X-RapidAPI-Key": rapid_key})
            parsed_response = json.loads(response.text)
        return Response(json.loads(response.text)['items'])


class InstrumentCompanyView(views.APIView):
    """
    Django class to establish a read only view for the instrument
    company profiles from the RAPID API Yahoo Finance api
    call to the original endpoint `stock/v2/get-profile`.
    """
    permission_classes = (AllowAny,)  # Allow anyone to use this view

    @method_decorator(cache_page(quick_api_timeout))
    def get(self, *args, **kwargs):
        """
        Method to make the request to the RAPID API endpoint for
        Instrument's company details.
        Gets the symbol by URL path and passes it via query parameter.
        """
        symbol = self.kwargs['symbol']
        response = requests_retry_session().get(
            'https://{}/stock/v2/get-profile?symbol={}'
            .format(host, symbol), headers={
                "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                "X-RapidAPI-Key": rapid_key})
        parsed_response = json.loads(response.text)

        # If the code is not 200 and the response is empty or has incorrect
        # Content, the call should be remade.
        while response.status_code and parsed_response.get(
                'assetProfile') is None:
            response = requests_retry_session().get(
                'https://{}/stock/v2/get-profile?symbol={}'
                .format(host, symbol, headers={
                    "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                    "X-RapidAPI-Key": rapid_key}))
            parsed_response = json.loads(response.text)
        return Response(json.loads(response.text))


class InstrumentFinancialStatementsView(views.APIView):
    """
    Django class to establish a read only view for the instrument
    financial statements from the RAPID API Yahoo Finance api
    call to the original endpoint `stock/v2/get-profile`.
    """
    permission_classes = (AllowAny,)  # Allow anyone to use this view

    @method_decorator(cache_page(quick_api_timeout))
    def get(self, *args, **kwargs):
        """
        Method to make the request to the RAPID API endpoint for
        Instrument's company details.
        Gets the symbol by URL path and passes it via query parameter.
        """
        symbol = self.kwargs['symbol']
        response = requests_retry_session().get(
            'https://{}/stock/v2/get-financials?symbol={}'.format(
                host,
                symbol),
            headers={
                "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                "X-RapidAPI-Key": rapid_key})
        parsed_response = json.loads(response.text)

        # If the code is not 200 and the response is empty or has incorrect
        # Content, the call should be remade.
        while response.status_code != 200 and parsed_response.get(
                'symbol') is None:
            response = requests_retry_session().get(
                'https://{}/stock/v2/get-financials?symbol={}'.format(
                    host, symbol), headers={
                    "X-RapidAPI-Host": settings.FIN_API_BASE_URL,
                    "X-RapidAPI-Key": rapid_key})
            parsed_response = json.loads(response.text)
        return Response(json.loads(response.text))
