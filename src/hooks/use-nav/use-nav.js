import { useState, useEffect } from "react";
import { useApiService } from "../../hooks/use-api-service/use-api-service";

export function useNav() {
  const apiService = useApiService();
  const [state, setState] = useState([]);

  const toNavItem = (app) => {
    const ref = app.references.find((x) => x.type === "_internal_reference")
      .reference;
    return {
      id: ref,
      _id: app.id,
      _parentId: app.parentId,
      name: app.name,
      url: `/applications/${ref}`,
    };
  };

  const getChildren = (apps, parent) => {
    const children = apps
      .filter((f) => f._parentId === parent._id)
      .map((m) => getChildren(apps, m));
    if (children.length > 0) {
      parent.children = [
        { id: parent.id, ref: parent.ref, name: parent.name, url: parent.url },
        ...children,
      ];
    }
    return parent;
  };

  const indentApps = (apps) => {
    const parents = apps
      .filter((f) => f._parentId === null)
      .map((m) => getChildren(apps, m));

    return parents;
  };

  useEffect(() => {
    (async () => {
      try {
        const appResp = await apiService("/api/applications/");
        const apps = JSON.parse(await appResp.data.text());
        const mapped = apps.map(toNavItem);
        const indentedApps = indentApps(mapped);

        const navItems = [
          {
            id: "home",
            name: "Home",
            url: "/",
          },
          {
            id: "applications",
            name: "Applications",
            children: [
              {
                id: "applications",
                ref: "applications",
                name: "All Applications",
                url: "/applications",
              },
              ...indentedApps,
            ],
          },
        ];

        setState(navItems);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return state;
}
