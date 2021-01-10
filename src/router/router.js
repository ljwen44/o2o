export const routes = [
    {
        path: '/login',
        component: () => import('@/views/login.vue'),
        meta: {
            title: "登录页"
        }
    },
    {
        path: '/',
        component: () => import('@/views/index.vue'),
        meta: {
            title: "主页"
        },
        redirect: "/info",
        children: [
            {
                path: "info",
                component: () => import('@/views/Info/index.vue'),
                meta: {
                    title: "首页"
                }
            },
            {
                path: "udetail",
                component: () => import('@/views/UserDetail/index.vue'),
                meta: {
                    title: "用户详情页"
                }
            },
            {
                path: "user",
                component: () => import('@/views/User/index.vue'),
                meta: {
                    title: "用户个人中心"
                },
                redirect: "/user/myzl",
                children: [
                    {
                        path: "myzl",
                        component: () => import('@/views/User/Information/index.vue'),
                        meta: {
                            title: "我的资料"
                        }
                    },
                    {
                        path: "friend",
                        component: () => import('@/views/User/Friend/index.vue'),
                        meta: {
                            title: "好友列表"
                        },
                        redirect: "/user/friend/myfriend",
                        children: [
                            {
                                path: "myfriend",
                                component: () => import('@/views/User/Friend/myfriend.vue'),
                                meta: {
                                    title: "我的好友"
                                }
                            },
                            {
                                path: "apply",
                                component: () => import('@/views/User/Friend/apply.vue'),
                                meta: {
                                    title: "好友申请"
                                }
                            }
                        ]
                    },
                    {
                        path: "edit",
                        component: () => import('@/views/User/Information/edit.vue'),
                        meta: {
                            title: "修改资料"
                        }
                    },
                    {
                        path: "order",
                        component: () => import('@/views/User/Order/index.vue'),
                        meta: {
                            title: "我的订单"
                        },
                        redirect: "/user/order/finish",
                        children: [
                            {
                                path: "finish",
                                component: () => import('@/views/User/Order/finish.vue'),
                                meta: {
                                    title: "订单"
                                }
                            },
                            {
                                path: "detail",
                                component: () => import('@/views/User/Order/detail.vue'),
                                meta: {
                                    title: "订单详情"
                                }
                            }
                        ]
                    },
                    {
                        path: "pjob",
                        redirect: "/user/pjob/mypub/index",
                        component: () => import('@/views/User/Pub/index.vue'),
                        children: [
                            {
                                path: "mypub",
                                component: () => import('@/views/User/Pub/MyPub/index.vue'),
                                meta: {
                                    title: "我的发布"
                                },
                                children: [
                                    {
                                        path: "index",
                                        component: () => import('@/views/User/Pub/MyPub/mypub.vue'),
                                    },
                                    {
                                        path: "detail",
                                        component: () => import('@/views/User/Pub/MyPub/detail.vue'),
                                    }
                                ]
                            },
                            {
                                path: "pub",
                                component: () => import('@/views/User/Pub/pub.vue'),
                                meta: {
                                    title: "发布兼职"
                                },
                            },
                        ]
                    },
                    {
                        path: "security",
                        component: () => import('@/views/User/Security/index.vue'),
                        meta: {
                            title: "安全中心"
                        }
                    },
                    {
                        path: "sysNotice",
                        component: () => import('@/views/User/SysNotice/index.vue'),
                        meta: {
                            title: "系统通知"
                        }
                    }
                ]
            },
            {
                path: "detail",
                component: () => import('@/views/Detail/index.vue'),
                meta: {
                    title: "家教详情" 
                }
            },
            {
                path: "/message",
                component: () => import("@/views/Message.vue"),
                meta: {
                    title: "消息窗口"
                }
            }
        ]
    },
    {
        path: "/admin",
        component: () => import('@/views/Admin/index.vue'),
        meta: {
            title: "管理员"
        },
        redirect: "/admin/analysis",
        children: [
            {
                path: "analysis",
                component: () => import('@/views/Admin/Analysis/index.vue'),
                meta: {
                    title: "数据分析"
                }
            },
            {
                path: 'index',
                component: () => import('@/views/Admin/Main/index.vue'),
                meta: {
                    title: "首页数据管理"
                },
                children: [
                    {
                        path: 'edit',
                        component: () => import('@/views/Admin/Main/edit.vue'),
                        meta: {
                            title: "首页数据添加"
                        }
                    },
                    {
                        path: 'main',
                        component: () => import('@/views/Admin/Main/main.vue'),
                        meta: {
                            title: "首页数据展示"
                        }
                    },
                ]
            },
            {
                path: 'user',
                component: () => import('@/views/Admin/User/index.vue'),
                meta: {
                    title: "用户管理"
                },
                redirect: "/admin/user/auth",
                children: [
                    {
                        path: "auth",
                        component: () => import('@/views/Admin/User/auth.vue'),
                        meta: {
                            title: "认证管理"
                        }
                    },
                    {
                        path: "all",
                        component: () => import('@/views/Admin/User/user.vue'),
                        meta: {
                            title: "查看用户"
                        }
                    },
                    {
                        path: "detail",
                        component: () => import('@/views/Admin/User/detail.vue'),
                        meta: {
                            title: "用户详情"
                        }
                    }
                ]
            },
            {
                path: "jobInfo",
                component: () => import('@/views/Admin/JobInfo/index.vue'),
                meta: {
                    title: "求教信息"
                }
            },
            {
                path: "security",
                component: () => import('@/views/Admin/Security/index.vue'),
                meta: {
                    title: "管理员安全中心"
                }
            }
        ]
    },
    
]
