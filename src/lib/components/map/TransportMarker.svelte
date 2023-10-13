<script lang="ts">
  import type { GeoGroup } from "$lib/utils/geo";
  import { getContext, onMount } from "svelte";
  import type Map from "ol/Map";
  import { Icon, Style } from "ol/style";
  import { Feature } from "ol";
  import Point from "ol/geom/Point";
  import { fromLonLat } from "ol/proj";
  import { Vector } from "ol/source";
  import { Vector as VectorLayer } from "ol/layer";

  export let group: GeoGroup;

  const { latitude, longitude } = group;

  const mapContext = getContext("map") as {
    instance: Map;
  };

  onMount(() => {
    if (!latitude || !longitude) return;

    const map = mapContext.instance;

    const iconStyle = new Style({
      image: new Icon({
        anchor: [ 0.5, .85 ],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: group.mode === "train" ? "/map/train.svg" : "/map/bus.svg",
        scale: 2
      })
    });
    const iconFeature = new Feature({
      geometry: new Point(fromLonLat([ longitude, latitude ]))
    });
    iconFeature.setStyle(iconStyle);

    const vectorSource = new Vector({
      features: [ iconFeature ]
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    map.addLayer(vectorLayer);

    return () => {
      map.removeLayer(vectorLayer);
    };
  });
</script>