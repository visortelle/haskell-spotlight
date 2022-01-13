import normalizeStyles from "../styles/normalize.css";
import globalsStyles from "../styles/globals.css";
import fontsStyles from "../styles/fonts.css";
import reactLibStyles from "@hackage-ui/react-lib/dist/react-lib.css";
import reactToastifyStyles from "react-toastify/dist/ReactToastify.css";
import hljsStyles from "highlight.js/styles/kimbie-light.css";

export const applyStyles = (target: HTMLElement) => {
  normalizeStyles.use({ target });
  fontsStyles.use({ target: document.head });
  globalsStyles.use({ target });
  reactLibStyles.use({ target });
  reactToastifyStyles.use({ target });
  hljsStyles.use({ target });
};
