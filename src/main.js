import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { highlight, focus } from "./directives";

import "vant/lib/index.css";
import {
  AddressList,
  AddressEdit,
  Skeleton,
  PullRefresh,
  List,
  Popup,
  ContactCard,
  SubmitBar,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
  Toast,
  Notify,
  Dialog,
  Icon,
  CellGroup,
  Cell,
  SwipeCell,
  Stepper,
  Form,
  Field,
  CheckboxGroup,
  Checkbox,
  Image as VanImage,
  Button,
  Tag,
  Sticky,
  Swipe,
  SwipeItem,
  Lazyload,
  Badge,
  Sidebar,
  SidebarItem,
  Collapse,
  CollapseItem,
  Tab,
  Tabs,
  Card,
  Empty,
  Grid,
  GridItem
} from "vant";

createApp(App)
  .use(AddressList)
  .use(AddressEdit)
  .use(Skeleton)
  .use(PullRefresh)
  .use(List)
  .use(Popup)
  .use(Grid)
  .use(GridItem)
  .use(Popup)
  .use(ContactCard)
  .use(SubmitBar)
  .use(ActionBar)
  .use(ActionBarIcon)
  .use(ActionBarButton)
  .use(Toast)
  .use(Notify)
  .use(Dialog)
  .use(Icon)
  .use(CellGroup)
  .use(Cell)
  .use(SwipeCell)
  .use(Stepper)
  .use(Form)
  .use(Field)
  .use(CheckboxGroup)
  .use(Checkbox)
  .use(VanImage)
  .use(Button)
  .use(Tag)
  .use(Sticky)
  .use(Swipe)
  .use(SwipeItem)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Badge)
  .use(Collapse)
  .use(CollapseItem)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(Empty)
  .use(Lazyload, {
    loading: require("./assets/images/placeholder.png")
  })
  .use(store)
  .use(router)
  .directive("highlight", highlight)
  .directive("focus", focus)
  .mount("#app");
