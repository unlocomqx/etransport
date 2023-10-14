<script lang="ts">
  import type { GeoGroup } from "$lib/utils/geo";
  import { Icon, Style } from "ol/style";
  import { Feature } from "ol";
  import { getContext, onMount } from "svelte";
  import Map from "ol/Map";
  import Point from "ol/geom/Point";
  import { fromLonLat } from "ol/proj";
  import { Vector } from "ol/source";
  import { Vector as VectorLayer } from "ol/layer";

  export let group: GeoGroup;

  $: ({ latitude, longitude } = group);
  $: icon = group.mode === "train" ? "/map/train.png" : "/map/bus.png";

  $: key = `${group.id}-${latitude}-${longitude}-${icon}`;
  $: updateIcon(), key;

  let iconStyle: Style | null = null;
  let iconFeature: Feature | null = null;

  const mapContext = getContext("map") as {
    instance: Map;
  };

  onMount(() => {
    if (!latitude || !longitude) return;

    const map = mapContext.instance;

    iconStyle = new Style({
      image: new Icon({
        anchor: [ 0.5, .85 ],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: icon,
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

  function updateIcon() {
    if (!latitude || !longitude) return;

    iconFeature?.setGeometry(new Point(fromLonLat([ longitude, latitude ])));
    iconFeature?.setStyle(new Style({
      image: new Icon({
        anchor: [ 0.5, .85 ],
        anchorXUnits: "fraction",
        anchorYUnits: "fraction",
        src: icon,
        scale: .75
      })
    }));
  }
</script>

<div class="away"
     data-cy="transport-marker"
     data-cy-id="{group.id}"
     data-cy-mode="{group.mode}"
></div>