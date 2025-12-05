export interface ArtistResponse {
  external_urls: { spotify: string };
  followers: {
    href: string;

    total: 0;
  };
  genres: string[];
  href: 'string';
  id: 'string';
  images: [
    {
      url: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228';
      height: number;
      width: number;
    },
  ];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
}
