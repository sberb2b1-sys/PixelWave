import Frame9722 from "@/views/Frame9722";
import Frame9561 from "@/views/Frame9561";
import Frame9274 from "@/views/Frame9274";
import Frame9429 from "@/views/Frame9429";

export const routes = [{
          path: "/frame9722",
          component: Frame9722,
          guid: "9:722",
        },
{
          path: "/frame9561",
          component: Frame9561,
          guid: "9:561",
        },
{
          path: "/",
          component: Frame9274,
          guid: "9:274",
        },
{
          path: "/frame9429",
          component: Frame9429,
          guid: "9:429",
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
