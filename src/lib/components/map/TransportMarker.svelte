<script lang="ts">
  import type { GeoGroup } from "$lib/utils/geo";
  import { afterUpdate, getContext, onMount } from "svelte";
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

  let iconStyle: Style | null = null;
  let iconFeature: Feature | null = null;

  onMount(() => {
    if (!latitude || !longitude) return;

    console.log("mount", group);

    const map = mapContext.instance;

    iconStyle = new Style({
      image: new Icon({
        anchor: [ 0.5, .85 ],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: group.mode === "train" ? "/map/train.png" : "/map/bus.png",
        scale: .75
      })
    });

    iconFeature = new Feature({
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

  afterUpdate(() => {
    const { latitude, longitude } = group;
    if (!latitude || !longitude) return;

    iconFeature?.setGeometry(new Point(fromLonLat([ longitude, latitude ])));
    iconFeature?.setStyle(new Style({
      image: new Icon({
        anchor: [ 0.5, .85 ],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: group.mode === "train" ? "/map/train.png" : "/map/bus.png",
        scale: .75
      })
    }));
  });
</script>

<div class="away" data-cy="transport-marker"></div>