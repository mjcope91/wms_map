from tethys_sdk.base import TethysAppBase, url_map_maker


class MountainTopMiningExplorer(TethysAppBase):
    """
    Tethys app class for Mountain Top Mining Explorer.
    """

    name = 'Mountaintop Mining Explorer'
    index = 'wms_map:home'
    icon = 'wms_map/images/mining.jpg'
    package = 'wms_map'
    root_url = 'wms-map'
    color = '#000080'
    description = ''
    tags = ''
    enable_feedback = False
    feedback_emails = []

        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='wms-map',
                           controller='wms_map.controllers.home'),
                    UrlMap(name='help_file',
                           url='wms-map/help_file',
                           controller='wms_map.controllers.help_file'),
                    UrlMap(name='technical_file',
                           url='wms-map/technical_file',
                           controller='wms_map.controllers.technical_file'),

        )

        return url_maps