import { VersaTiles } from "@versatiles/container";
import { SVGRenderer } from "./renderer/renderer_svg.js";
import { readFileSync } from "fs";
import { Point2D } from "./lib/geometry.js";
import { resolve } from "path";
import type { StyleSpecification } from "@maplibre/maplibre-gl-style-spec";
import { renderVectorTiles } from "./processor/render.js";

const DIRNAME = new URL("../", import.meta.url).pathname.substring(1);

const style: StyleSpecification = {
  version: 8,
  sources: {
    default: {
      type: "vector",
      tiles: [
        "https://www.watson.ch/ddj/versatiles/tiles/2025/de/wahlkreise/{z}/{x}/{y}",
      ],
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "#161616",
      },
    },
    {
      id: "default-fill",
      type: "fill",
      source: "default",
      "source-layer": "wahlkreise",
      layout: {},
      paint: {
        "fill-color": [
          "let",
          "results",
          ["literal", {}],
          [
            "case",
            ["has", ["to-string", ["id"]], ["var", "results"]],
            [
              "step",
              [
                "get",
                "yes",
                ["get", ["to-string", ["id"]], ["var", "results"]],
              ],
              "#F40F97",
              35,
              "#F061B6",
              40,
              "#EC98CA",
              45,
              "#E8BAD5",
              50,
              "#C9FFE5",
              55,
              "#76F6B7",
              60,
              "#27F590",
              65,
              "#17D477",
            ],
            "#545454",
          ],
        ],
      },
    },
    {
      id: "default-borders",
      type: "line",
      source: "default",
      "source-layer": "wahlkreise",
      layout: {},
      paint: {
        "line-color": "#161616",
        "line-width": 0.5,
      },
    },
  ],
};

await renderVectorTiles(
  {
    renderer: new SVGRenderer({ width: 450, height: 600, scale: 1 }),
    container: new VersaTiles(
      resolve(DIRNAME, "../versatiles-containers/2025/de/wahlkreise.versatiles")
    ),
    style: style,
    view: {
      center: new Point2D(9.977, 51.338),
      zoom: 6,
    },
  },
  resolve(DIRNAME, "docs/demo.svg")
);
