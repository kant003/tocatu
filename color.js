const bemoles = [
    22, 25, 27, 30, 32, 34, 37, 39, 42, 44, 46, 49, 51, 54, 56, 58, 61, 63,
    66, 68, 70, 73, 75, 78, 80, 82, 85, 87, 90, 92, 94, 97, 99, 102, 104,
    106,
  ];

  const tracksColors = [
    { hn:0, hb:0.2 }, // track 1
    { hn:0.5, hb:0.5 }, // track 2
    { hn:0.9, hb:0.1 }, // track 3
  ];

  
//stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
      /* accepts parameters
       * h  Object = {h:x, s:y, v:z}
       * OR
       * h, s, v
       */
    function HSVtoRGB(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
          (s = h.s), (v = h.v), (h = h.h);
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
          case 0:
            (r = v), (g = t), (b = p);
            break;
          case 1:
            (r = q), (g = v), (b = p);
            break;
          case 2:
            (r = p), (g = v), (b = t);
            break;
          case 3:
            (r = p), (g = q), (b = v);
            break;
          case 4:
            (r = t), (g = p), (b = v);
            break;
          case 5:
            (r = v), (g = p), (b = q);
            break;
        }
        return {
          r: Math.round(r * 255),
          g: Math.round(g * 255),
          b: Math.round(b * 255),
        };
      }

      /* accepts parameters
       * r  Object = {r:x, g:y, b:z}
       * OR
       * r, g, b
       */
      function RGBtoHSV(r, g, b) {
        if (arguments.length === 1) {
          (g = r.g), (b = r.b), (r = r.r);
        }
        var max = Math.max(r, g, b),
          min = Math.min(r, g, b),
          d = max - min,
          h,
          s = max === 0 ? 0 : d / max,
          v = max / 255;

        switch (max) {
          case min:
            h = 0;
            break;
          case r:
            h = g - b + d * (g < b ? 6 : 0);
            h /= 6 * d;
            break;
          case g:
            h = b - r + d * 2;
            h /= 6 * d;
            break;
          case b:
            h = r - g + d * 4;
            h /= 6 * d;
            break;
        }

        return {
          h: h,
          s: s,
          v: v,
        };
      }



      
      // Re-maps a number from one range to another
      function remap(x, in_min, in_max, out_min, out_max) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
      }


      function calculeNoteColor(timeActual, note, timeOffset, trackIndex) {
        let p =  timeActual - note.time
        
        let v=remap(-timeOffset,  p, p-note.duration, 1, 0.2);

        let trackColor = tracksColors[trackIndex%tracksColors.length];
        let h = bemoles.includes(note.midi)  ? trackColor.hb : trackColor.hn;
        c = HSVtoRGB(h, 1, v);
        return c
      }