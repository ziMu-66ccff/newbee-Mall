export function localGet(key: string) {
  const value = window.localStorage.getItem(key);
  if (typeof value === null) {
    return false;
  } else {
    return JSON.parse(value as string);
  }
}

export function localSet(key: string, value: object) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function localRemove(key: string) {
  window.localStorage.removeItem(key);
}

const pathMap = {
  index: "首页",
  login: "登录页面",
  swiper: "轮播图",
  hot: "热销商品",
  new: "新品上市",
  recommend: "为你推荐",
  category: "分类管理",
  level2: "分类二级管理",
  level3: "分类三级管理",
  good: "商品管理",
};

export { pathMap };

// 单张文件上传
export const uploadImgServer =
  "http://backend-api-02.newbee.ltd/manage-api/v1/upload/file";

// 多张图片上传
export const uploadImgsServer =
  "http://backend-api-02.newbee.ltd/manage-api/v1/upload/files";
