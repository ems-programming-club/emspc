// Everything the site uses from Material 3 Expressive (@m3e/web), nothing more.
// Rebuild with: cd m3e-build && npm install && npm run build  ->  ../assets/m3e.js

// Components
import "@m3e/web/theme";
import "@m3e/web/app-bar";
import "@m3e/web/icon";
import "@m3e/web/icon-button";
import "@m3e/web/button";
import "@m3e/web/card";
import "@m3e/web/heading";
import "@m3e/web/shape";
import "@m3e/web/list";
import "@m3e/web/avatar";
import "@m3e/web/drawer-container";
import "@m3e/web/divider";
import "@m3e/web/switch";
import { M3eSnackbar } from "@m3e/web/snackbar";

// The site's inline scripts are plain JS, so expose the snackbar service globally
window.M3eSnackbar = M3eSnackbar;
import "@m3e/web/loading-indicator";
import "@m3e/web/form-field";
import "@m3e/web/checkbox";
import "@m3e/web/chips";

// Icons (SVG modules, so no Material Symbols font request)
import "@m3e/icons/outlined/home";
import "@m3e/icons/outlined/trophy";
import "@m3e/icons/outlined/article";
import "@m3e/icons/outlined/calendar_month";
import "@m3e/icons/outlined/folder_code";
import "@m3e/icons/outlined/info";
import "@m3e/icons/outlined/settings";
import "@m3e/icons/outlined/palette";
import "@m3e/icons/outlined/account_circle";
import "@m3e/icons/outlined/check_circle";
import "@m3e/icons/outlined/logout";
import "@m3e/icons/outlined/menu";
import "@m3e/icons/outlined/menu_open";
import "@m3e/icons/outlined/redeem";
import "@m3e/icons/outlined/arrow_back";
import "@m3e/icons/outlined/arrow_forward";
import "@m3e/icons/outlined/location_on";
import "@m3e/icons/outlined/schedule";
import "@m3e/icons/outlined/groups";
import "@m3e/icons/outlined/school";
import "@m3e/icons/outlined/terminal";
import "@m3e/icons/outlined/rocket_launch";
import "@m3e/icons/outlined/event";
import "@m3e/icons/outlined/event_busy";
import "@m3e/icons/outlined/cloud_off";
import "@m3e/icons/outlined/close";
import "@m3e/icons/outlined/check";
import "@m3e/icons/outlined/notifications";
import "@m3e/icons/outlined/notifications_active";
import "@m3e/icons/outlined/notifications_off";
import "@m3e/icons/outlined/light_mode";
import "@m3e/icons/outlined/dark_mode";
import "@m3e/icons/outlined/brightness_auto";
import "@m3e/icons/outlined/send";
import "@m3e/icons/outlined/login";
import "@m3e/icons/outlined/person";
import "@m3e/icons/outlined/lock";
import "@m3e/icons/outlined/open_in_new";
import "@m3e/icons/outlined/code";
import "@m3e/icons/outlined/star";
import "@m3e/icons/outlined/fork_right";
import "@m3e/icons/outlined/update";
import "@m3e/icons/outlined/forum";
import "@m3e/icons/outlined/handshake";
import "@m3e/icons/outlined/campaign";
