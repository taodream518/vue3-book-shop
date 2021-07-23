// 聚焦指令
const focus = {
  beforeMount: (el, binding, vnode) => {
    el.focus && el.focus();
  }
};

// 高亮指令
const highlight = {
  beforeMount: (el, binding, vnode) => {
    el.style.background = binding.value;
  }
};

export { focus, highlight };
