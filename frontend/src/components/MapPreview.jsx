import React from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

const MapPreview = ({ lat, lon, locationName }) => {
    const mapUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=12`;

    // Use OpenStreetMap static tile service to embed map directly
    const zoom = 10;
    const width = 400;
    const height = 200;

    // Calculate tile coordinates for static map
    const tileSize = 256;
    const centerX = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
    const centerY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

    // Create a simple embedded map using multiple tiles
    const staticMapUrl = `https://tile.openstreetmap.org/${zoom}/${centerX}/${centerY}.png`;

    return (
        <div className="map-container w-full max-w-md">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-cyan/20 to-accent-purple/20 rounded-2xl blur-xl opacity-50"></div>
                <div className="relative glass rounded-2xl border border-white/20">
                    <div className="p-4 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-accent-cyan" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">🗺️ Interactive Map</h4>
                                    <p className="text-dark-400 text-sm">{locationName}</p>
                                </div>
                            </div>
                            <a
                                href={mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary px-3 py-2 text-sm flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                <Navigation className="w-3 h-3" />
                                <span>Explore</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    <div className="relative overflow-hidden">
                        {/* Embedded Map */}
                        <div className="relative">
                            <img
                                src={staticMapUrl}
                                alt={`Map of ${locationName}`}
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            {/* Fallback if image fails to load */}
                            <div
                                className="absolute inset-0 glass flex flex-col items-center justify-center text-gray-200 text-sm space-y-3"
                                style={{ display: 'none' }}
                            >
                                <div className="text-4xl animate-bounce">🗺️</div>
                                <div className="text-center">
                                    <p className="font-bold text-white">{locationName}</p>
                                    <p className="text-dark-400">Map preview loading...</p>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                            {/* Location marker overlay */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center animate-bounce-slow">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>

                        {/* Map info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold text-white">{locationName}</p>
                                    <p className="text-xs text-gray-300 font-mono">
                                        {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-300">
                                    <span className="w-2 h-2 bg-accent-emerald rounded-full animate-pulse"></span>
                                    <span>Live</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapPreview;