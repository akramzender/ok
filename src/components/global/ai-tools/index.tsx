import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import Loader from "../loader";
import { Bot, DownloadIcon, FileTextIcon, FileVideoIcon, Pencil, StarsIcon, VideoIcon } from "lucide-react";

type Props = {
  plan: "PRO" | "FREE";
  trial: boolean;
  videoId: string;
};

const AiTools = ({ plan, trial, videoId }: Props) => {
  return (
    <TabsContent
      value="Ai Tools"
      className="p-5 bg-[#1d1d1d] rounded-xl flex flex-col gap-y-10"
    >
      {" "}
      <div className="flex items-center">
        <div className="w-8/12">
          <h2 className="text-3xl font-bold">Ai Tools</h2>
          <p className="text-[#bdbdbd]">
            Taking your video to the next <br /> step with the power of AI
          </p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Button className="mt-2 text-sm bg-white hover:bg-[#9e9e9e] cursor-pointer text-black">
            <Loader state={false} color="#000">
              Try now
            </Loader>
          </Button>
          <Button className="mt-2 text-sm bg-[#212121] e hover:bg-[#5a5a5a] cursor-pointer text-white">
            <Loader state={false} color="#000">
              Pay now
            </Loader>
          </Button>
          {/*<Button className="mt-2 text-sm bg-white hover:bg-[#9e9e9e] cursor-pointer text-black">
            <Loader state={false} color="#000">
              Generate Now
            </Loader>
          </Button>*/}
        </div>
      </div>
      <div className="border-[1px] rounded-xl p-4 gap-4 flex flex-col bg-[#1b0f1b7f]">
            <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-[#a22fe0]">Odix AI</h2>
                <StarsIcon color="#a22fe0" fill="#a22fe0"/>
            </div>
            <div className="flex gap-2 items-start">
                <div className="p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b]">
                    <Pencil color="#a22fe0" />
                </div>
                <div className="flex flex-col">
                    <h3 className="textmdg">Summery</h3>
                    <p className="text-muted-foreground text-sm">
                        Generate a description for your video using AI
                    </p>
                </div>
            </div>
            <div className="flex gap-2 items-start">
                <div className="p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b]">
                    <FileTextIcon color="#a22fe0" />
                </div>
                <div className="flex flex-col">
                    <h3 className="textmdg">Summery</h3>
                    <p className="text-muted-foreground text-sm">
                        Generate a description for your video using AI
                    </p>
                </div>
            </div> <div className="flex gap-2 items-start">
                <div className="p-2 rounded-full border-[#2d2d2d] border-[2px] bg-[#2b2b2b]">
                    <Bot color="#a22fe0" />
                </div>
                <div className="flex flex-col">
                    <h3 className="textmdg">Summery</h3>
                    <p className="text-muted-foreground text-sm">
                        Viewers can ask questions on your video and our ai agent will respond
                    </p>
                </div>
            </div>
      </div>
    </TabsContent>
  );
};

export default AiTools;