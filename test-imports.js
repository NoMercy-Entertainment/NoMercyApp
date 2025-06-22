console.log("Testing import resolution...");

try {
  console.log("Testing Vue import...");
  import("@/config/global")
    .then((config) => {
      console.log("Global config loaded:", config);
    })
    .catch((err) => {
      console.error("Failed to load global config:", err);
    });

  console.log("Testing router import...");
  import("@/router")
    .then((router) => {
      console.log("Router loaded:", router);
    })
    .catch((err) => {
      console.error("Failed to load router:", err);
    });

  console.log("Testing store import...");
  import("@/store/user")
    .then((store) => {
      console.log("User store loaded:", store);
    })
    .catch((err) => {
      console.error("Failed to load user store:", err);
    });
} catch (error) {
  console.error("Test script error:", error);
}

console.log("Test script completed");
