import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

function dropGoogleFontImport() {
  return {
    postcssPlugin: "drop-google-font-import",
    AtRule: {
      import(atRule) {
        if (String(atRule.params).includes("fonts.googleapis.com")) {
          atRule.remove();
        }
      },
    },
  };
}

dropGoogleFontImport.postcss = true;

export default {
  plugins: [dropGoogleFontImport(), tailwindcss(), autoprefixer()],
};
