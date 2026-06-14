import Frame2442 from "@/views/Frame2442";
import Frame2367 from "@/views/Frame2367";
import Frame2146 from "@/views/Frame2146";
import Frame218 from "@/views/Frame218";

export const routes = [{
          path: "/frame2442",
          component: Frame2442,
          guid: "2:442",
        },
{
          path: "/frame2367",
          component: Frame2367,
          guid: "2:367",
        },
{
          path: "/frame2146",
          component: Frame2146,
          guid: "2:146",
        },
{
          path: "/",
          component: Frame218,
          guid: "2:18",
        }];


export const guidPathMap = new Map(
  routes.map((item) => [item.guid, item.path])
);
export const pathGuidMap = new Map(
  routes.map((item) => [item.path, item.guid])
);

export const getPathByGuid = (guid: string) => {
  return guidPathMap.get(guid) || "";
};

export const getGuidByPath = (path: string) => {
  return pathGuidMap.get(path) || "";
};
