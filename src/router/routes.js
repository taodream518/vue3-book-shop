const Home = () => import("views/home/Home");
const Category = () => import("views/category/Category");
const Shopcart = () => import("views/shopcart/Shopcart");
const CreateOrder = () => import("views/order/CreateOrder");
const Order = () => import("views/order/Order");
const OrderDetail = () => import("views/order/OrderDetail");
const Profile = () => import("views/profile/Profile");
const Address = () => import("views/profile/Address");
const AddressEdit = () => import("views/profile/AddressEdit");
const Collect = () => import("views/profile/Collect");
const Setting = () => import("views/profile/Setting");
const About = () => import("views/profile/About");
const Register = () => import("views/profile/Register");
const Login = () => import("views/profile/Login");
const Detail = () => import("views/detail/Detail");

const routes = [
  {
    path: "",
    name: "DefaultHome",
    component: Home,
    meta: {
      title: "图书商城-首页"
    }
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      title: "图书商城-首页"
    }
  },
  {
    path: "/category",
    name: "Category",
    component: Category,
    meta: {
      title: "图书商城-商品分类"
    }
  },
  {
    path: "/detail",
    name: "Detail",
    component: Detail,
    meta: {
      title: "图书商城-商品详情"
    }
  },
  {
    path: "/shopcart",
    name: "Shopcart",
    component: Shopcart,
    meta: {
      title: "图书商城-购物车",
      isAuth: true
    }
  },
  {
    path: "/create_order",
    name: "CreateOrder",
    component: CreateOrder,
    meta: {
      title: "图书商城-创建订单",
      isAuth: true
    }
  },
  {
    path: "/order_detail",
    name: "OrderDetail",
    component: OrderDetail,
    meta: {
      title: "图书商城-订单详情",
      isAuth: true
    }
  },
  {
    path: "/order",
    name: "Order",
    component: Order,
    meta: {
      title: "图书商城-订单列表",
      isAuth: true
    }
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      title: "图书商城-个人中心",
      isAuth: true
    }
  },
  {
    path: "/address",
    name: "Address",
    component: Address,
    meta: {
      title: "图书商城-地址管理",
      isAuth: true
    }
  },
  {
    path: "/address_edit",
    name: "AddressEdit",
    component: AddressEdit,
    meta: {
      title: "图书商城-地址编辑",
      isAuth: true
    }
  },
  {
    path: "/setting",
    name: "Setting",
    component: Setting,
    meta: {
      title: "图书商城-账号管理",
      isAuth: true
    }
  },
  {
    path: "/collect",
    name: "Collect",
    component: Collect,
    meta: {
      title: "图书商城-我的收藏",
      isAuth: true
    }
  },
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      title: "图书商城-关于我们",
      isAuth: true
    }
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "图书商城-用户注册"
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "图书商城-用户登录"
    }
  }
];

export default routes;
