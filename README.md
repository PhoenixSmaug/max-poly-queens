# Independent Queens on Polyominoes

### Authors
* Alexis Langlois-Rémillard (alexislangloisremillard@gmail.com) https://alexisl-r.github.io/
* Mia Müßig (nienna@miamuessig.de) https://miamuessig.de/

---

## Website

This the companion web simulator for our research on maximum independent (non-attacking) queens on polyominoes. The simulator is live at:

https://phoenixsmaug.github.io/max-poly-queens/

All gadgets from the paper together with the full encoding are available as presets. The optimization problem is solved using the open-source ILP solver [HiGHS](https://highs.dev/) running in the browser with WebAssembly.


## Persistent Local Version

We provide a fully local version in `dist-archive/`, in case the website ever breaks. It can be run fully offline with standard python:

```bash
git clone https://github.com/PhoenixSmaug/max-poly-queens.git
cd max-poly-queens/dist-archive
python -m http.server 3000 --bind 127.0.0.1
```

## Development

The archive version can be rebuilt with:

```bash
cd max-poly-queens/ && npx vite build --base=./ --outDir dist-archive
```

Alternatively you can use `npm` for local testing:

```bash
cd max-poly-queens/ && npm run dev
```

---

### Acknowledgements

Alexis Langlois-Rémillard's research is funded by a postdoctoral research scholarship of the Fonds de Recherche du Québec -- Nature et Technologie [grant number 326641] and was funded by the Deutsche Forschungsgemeinschaft (DFG, German Research Foundation) under Germany's Excellence Strategy -- GZ 2047/2, Projekt-ID 390685813.

### License
This project is licensed under the MIT License - see LICENSE file for details. If you use this code for academic purposes, please cite the paper: 

Alexis Langlois-Rémillard and Mia Müßig, Maximum Independent Queen Set on Polyominoes is NP-Complete, [ARXIV LINK WILL BE ADDED SHORTLY], 2026.
