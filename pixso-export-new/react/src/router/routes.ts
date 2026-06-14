import Frame9949 from "@/views/Frame9949";
import Frame9893 from "@/views/Frame9893";
import Frame9849 from "@/views/Frame9849";
import Frame2442 from "@/views/Frame2442";
import Frame91439 from "@/views/Frame91439";
import Frame91335 from "@/views/Frame91335";
import Frame91223 from "@/views/Frame91223";
import Frame91 from "@/views/Frame91";
import Frame51 from "@/views/Frame51";
import Frame2367 from "@/views/Frame2367";
import Frame5113 from "@/views/Frame5113";
import Frame9722 from "@/views/Frame9722";
import Frame5363 from "@/views/Frame5363";
import Frame912 from "@/views/Frame912";
import Frame5308 from "@/views/Frame5308";
import Frame5224 from "@/views/Frame5224";
import Frame2146 from "@/views/Frame2146";
import Frame9561 from "@/views/Frame9561";
import Frame91553 from "@/views/Frame91553";
import Frame218 from "@/views/Frame218";
import Frame9274 from "@/views/Frame9274";
import Frame9429 from "@/views/Frame9429";

export const routes = [{
          path: "/frame9949",
          component: Frame9949,
          guid: "9:949",
        },
{
          path: "/frame9893",
          component: Frame9893,
          guid: "9:893",
        },
{
          path: "/frame9849",
          component: Frame9849,
          guid: "9:849",
        },
{
          path: "/frame2442",
          component: Frame2442,
          guid: "2:442",
        },
{
          path: "/frame91439",
          component: Frame91439,
          guid: "9:1439",
        },
{
          path: "/frame91335",
          component: Frame91335,
          guid: "9:1335",
        },
{
          path: "/frame91223",
          component: Frame91223,
          guid: "9:1223",
        },
{
          path: "/frame91",
          component: Frame91,
          guid: "9:1",
        },
{
          path: "/frame51",
          component: Frame51,
          guid: "5:1",
        },
{
          path: "/frame2367",
          component: Frame2367,
          guid: "2:367",
        },
{
          path: "/frame5113",
          component: Frame5113,
          guid: "5:113",
        },
{
          path: "/frame9722",
          component: Frame9722,
          guid: "9:722",
        },
{
          path: "/frame5363",
          component: Frame5363,
          guid: "5:363",
        },
{
          path: "/frame912",
          component: Frame912,
          guid: "9:12",
        },
{
          path: "/frame5308",
          component: Frame5308,
          guid: "5:308",
        },
{
          path: "/frame5224",
          component: Frame5224,
          guid: "5:224",
        },
{
          path: "/frame2146",
          component: Frame2146,
          guid: "2:146",
        },
{
          path: "/frame9561",
          component: Frame9561,
          guid: "9:561",
        },
{
          path: "/frame91553",
          component: Frame91553,
          guid: "9:1553",
        },
{
          path: "/",
          component: Frame218,
          guid: "2:18",
        },
{
          path: "/frame9274",
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
