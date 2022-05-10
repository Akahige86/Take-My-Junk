import * as React from 'react';
import myLocationIcon from './pointer.png';
import SFHIcon from './been2.svg';


const MyMap = () => {
  // Create a reference to the HTML element we want to put the map on
  const mapRef = React.useRef(null);

  const myPositionCord = {lat: 52.5, lng: 13.4};
  const skipForHireCord = {lat: 52.45, lng: 13.4};

  /**
   * Create the map instance
   * While `useEffect` could also be used here, `useLayoutEffect` will render
   * the map sooner
   */
  React.useLayoutEffect(() => {
    // `mapRef.current` will be `undefined` when this hook first runs; edge case that
    if (!mapRef.current) return;
    const H = window.H;
    const platform = new H.service.Platform({
        apikey: "hrn:here:authorization::org932282844:project/1652100769323"
    });
    const defaultLayers = platform.createDefaultLayers();
    const hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: myPositionCord,
      zoom: 10,
      pixelRatio: window.devicePixelRatio || 1
    });

    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));

    const ui = H.ui.UI.createDefault(hMap, defaultLayers);

    // My Code:
    // Create a marker icon from an image URL:
    const myPositionIcon = new H.map.Icon(myLocationIcon);
    const skipForHireIcon = new H.map.Icon(SFHIcon);

    // Create a marker using the previously instantiated icon:
    const myPosition = new H.map.Marker(myPositionCord, { icon: myPositionIcon });
    const skipForHirePosition = new H.map.Marker(skipForHireCord, { icon: skipForHireIcon });
    

    // Add the marker to the map:
    hMap.addObject(myPosition);
    hMap.addObject(skipForHirePosition);

    //center on my position
    let coords = myPositionCord;
    hMap.setCenter(coords);
    hMap.setZoom(10);


    // This will act as a cleanup to run once this hook runs again.
    // This includes when the component un-mounts
    return () => {
      hMap.dispose();
    };
  }, [mapRef]); // This will run this hook every time this ref is updated

  return <div className="map" ref={mapRef} style={{ height: "200px" }} />;
};

export default MyMap;