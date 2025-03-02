const apiRoutePermissions = [
  {
    route: "/api/dashboard",
    methods: [
      { method: "GET", permissions: ["view_admin_dashboard"] },
      { method: "PUT", permissions: ["update_admin_dashboard"] },
    ],
  },
  {
    route: "/api/admin",
    methods: [
      { method: "GET", permissions: ["view_admin"] },
      { method: "POST", permissions: ["create_admin"] },
      { method: "DELETE", permissions: ["delete_admin"] },
    ],
  },
  {
    route: "/api/tickets",
    methods: [
      { method: "GET", permissions: ["view_tickets"] },
      { method: "POST", permissions: ["create_tickets"] },
    ],
  },
  {
    route: "/api/reports",
    methods: [
      { method: "GET", permissions: ["view_reports"] },
      { method: "POST", permissions: ["generate_reports"] },
    ],
  },
  {
    route: "/api/letterrequests",
    methods: [
      { method: "GET", permissions: ["view_requests"] },
      { method: "POST", permissions: ["create_requests"] },
    ],
  },
  {
    route: "/api/recipients",
    methods: [
      { method: "GET", permissions: ["view_recipients"] },
      { method: "POST", permissions: ["create_recipients"] },
    ],
  },

  {
    route: "/api/users/all",
    methods: [
      { method: "GET", permissions: ["view_all_users"] },
      { method: "POST", permissions: ["create_users"] },
      { method: "DELETE", permissions: ["delete_users"] },
    ],
  },
  {
    route: "/api/users/[uuid]",
    methods: [
      { method: "GET", permissions: ["manage_users"] },
      { method: "POST", permissions: ["create_users"] },
      { method: "DELETE", permissions: ["delete_users"] },
    ],
  },
  {
    route: "/api/users/alllllll",
    methods: [
      { method: "GET", permissions: ["view_users"] },
      { method: "POST", permissions: ["create_users"] },
      { method: "DELETE", permissions: ["delete_users"] },
    ],
  },
  {
    route: "/api/myaccount",
    methods: [
      { method: "GET", permissions: ["view_myaccount"] },
      { method: "PUT", permissions: ["update_myaccount"] },
    ],
  },
  {
    route: "/api/notifications",
    methods: [{ method: "GET", permissions: ["view_notifications"] }],
  },
];



export default apiRoutePermissions; 