describe("My First Test", () => {
  it("Visits the Kitchen Sink", () => {
    const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
    cy.on("uncaught:exception", (err) => {
      /* returning false here prevents Cypress from failing the test */
      if (resizeObserverLoopErrRe.test(err.message)) {
        return false;
      }
    });

    // mock the oauth flow
    cy.intercept(
      { method: "GET", url: "/mock-auth/.well-known/openid-configuration" },
      {
        issuer: "http://localhost",
        authorization_endpoint: "/mock-auth/authorize",
        end_session_endpoint: "/mock-auth/endsession",
        token_endpoint: "/mock-auth/token",
        jwks_uri: "/mock-auth/jwks",
        response_types_supported: ["query", "fragment", "form_post"],
        subject_types_supported: ["public"],
        id_token_signing_alg_values_supported: ["RS256"],
      }
    );
    cy.intercept({ method: "GET", url: "/mock-auth/authorize*" }, (req) => {
      req.redirect(
        `${req.query.redirect_uri}?code=somerandomstring&state=${req.query.state}`
      );
    });

    cy.intercept("POST", "/mock-auth/token", {
      statusCode: 200,
      body: {
        token_type: "Bearer",
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_in: 15778800,
      },
    });
    // end mock ouath flow

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/mock-api/api/applications/", // that have a URL that matches '/users/*'
      },
      [
        {
          applicationTypeId: 1,
          environmentId: null,
          id: 1,
          name: "Test App",
          parentId: null,
          references: [
            {
              reference: "test_app",
              type: "_internal_reference",
            },
          ],
        },
      ]
    ).as("getApps"); // and assign an alias

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/mock-api/api/referenced-applications/?type=_internal_reference&reference=test_app", // that have a URL that matches '/users/*'
      },
      {
        applicationTypeId: 1,
        environmentId: null,
        id: 1,
        name: "Test App",
        parentId: null,
        references: [
          {
            reference: "test_app",
            type: "_internal_reference",
          },
        ],
      }
    ).as("getReferencedApp"); // and assign an alias

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/mock-api/api/applications/1/control-statuses",
      },
      []
    );

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/mock-api/api/application-types",
      },
      []
    );

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/mock-api/api/environments",
      },
      []
    );

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/mock-api/api/applications/1/quality-models",
      },
      []
    );

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/mock-api/storage/applications/test_app/knowledge/test_knowledge/_index.md", // that have a URL that matches '/users/*'
      },
      "test"
    ).as("getContent"); // and assign an alias

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "/mock-api/storage/applications//listing.json", // that have a URL that matches '/users/*'
      },
      "{}"
    ).as("getListing"); // and assign an alias

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "https://dev.azure.com/my-org/my-project/_apis/git/repositories/?api-version=6.1-preview.1",
      },
      JSON.stringify({ count: 1 })
    ).as("getContent"); // and assign an alias

    cy.intercept(
      {
        method: "GET", // Route all GET requests
        url: "https://dev.azure.com/my-org/my-project/_apis/git/repositories/airview_demo_applications/items?versionType=Branch&version=main&path=listing.json&includeContent=false&api-version=6.1-preview.1",
      },
      JSON.stringify({
        url: "https://dev.azure.com/my-org/my-id/_apis/git/repositories/repo-id/items?path=%2Flisting.json&versionType=Branch&version=main&versionOptions=None",
      })
    ).as("getContent"); // and assign an alias

    cy.intercept(
      "GET", // Route all GET requests
      "https://dev.azure.com/my-org/my-id/_apis/git/repositories/repo-id/items?path=%2Flisting.json&versionType=Branch&version=main&versionOptions=None&includeContent=false",
      { statusCode: 200, body: "{}" }
    ).as("getListingRepoData"); // and assign an alias

    cy.intercept(
      "GET", // Route all GET requests
      "https://dev.azure.com/my-org/my-id/_apis/git/repositories/repo-id/items?path=%2Flisting.json&versionType=Branch&version=main&versionOptions=None",
      { statusCode: 200, body: "{}" }
    ).as("getListingRepoContent"); // and assign an alias

    cy.intercept(
      "GET", // Route all GET requests
      "https://dev.azure.com/my-org/my-id/_apis/git/repositories/repo-id/items?path=%2Flisting.json&versionType=Branch&version=main&versionOptions=None",
      { statusCode: 200, body: "{}" }
    ).as("getListingRepoContent"); // and assign an alias

    cy.intercept(
      "GET", // Route all GET requests
      "https://dev.azure.com/my-org/my-project/_apis/git/repositories/airview_demo_applications/refs?filter=heads/&api-version=6.1-preview.1",
      {
        statusCode: 200,
        body: JSON.stringify({
          value: [
            {
              name: "refs/heads/main",
              url: "https://dev.azure.com/my-org/my-id/_apis/git/repositories/repo-id/refs?filter=heads%2Fmain",
            },
            {
              name: "refs/heads/other",
              url: "https://dev.azure.com/my-org/my-id/_apis/git/repositories/repo-id/refs?filter=heads%2Ftemp-3",
            },
          ],
          count: 2,
        }),
      }
    ).as("getRepoBranches"); // and assign an alias

    cy.intercept(
      "GET", // Route all GET requests
      "https://dev.azure.com/my-org/my-project/_apis/git/policy/**",
      { statusCode: 200, body: JSON.stringify({ count: 0, value: [] }) }
    ).as("getConfigurations"); // and assign an alias

    cy.intercept(
      "GET", // Route all GET requests
      "https://dev.azure.com/my-org/my-project/_apis/git/repositories/airview_demo_applications/items?versionType=Branch&version=main&path=test_app/_index.md&includeContent=false&api-version=6.1-preview.1",
      {
        statusCode: 404,

        body: "{}",
      }
    ).as("getContent"); // and assign an alias

    cy.visit("http://localhost:3000/applications/test_app");

    cy.findByRole("generic", { name: "Enable Preview Mode" }).click();
    cy.wait(100);
    cy.findByRole("button", { name: "Switch Working Branch" }).click();
    /* cy.contains("View").click(); */
    //    cy.root().first("MuiTypography-root").contains("Other Demo Application");
  });
});
