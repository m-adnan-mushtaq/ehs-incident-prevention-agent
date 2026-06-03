import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

type IconCardProps = {
  Icon: any;
  label: string;
  value: string;
  iconClassName?: string;
  visibleGraph?: boolean;
};

export const IconCard = ({
  Icon,
  label,
  iconClassName,
  value,
  visibleGraph,
}: IconCardProps) => {
  return (
    <Card className="border-0 relative flex flex-row items-center gap-4 rounded-md sm:rounded-xl p-4 md:py-6">
      <div
        className={cn(
          "p-2 size-14 rounded-full shadow flex items-center justify-center",
          iconClassName
        )}
      >
        <Icon className="stroke-3" />
      </div>
      <div className="flex flex-col gap-0">
        <p className="text-muted-foreground font-semibold text-sm">{label}</p>
        <h5 className="text-foreground text-lg md:text-2xl font-semibold">
          {value}
        </h5>
      </div>
      {visibleGraph && (
        <div className="absolute right-4 bottom-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="62"
            height="32"
            fill="none"
            viewBox="0 0 62 32"
          >
            <path
              stroke="url(#paint0_linear_8_206)"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M2 29.704s6.146 1.79 12.292 0C28.614 25.53 24-1 35 6c13.178 8.386 23.656 7.939 25.5-4"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_8_206"
                x1="-35"
                x2="48.56"
                y1="38"
                y2="-12.866"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#4F2CFF"></stop>
                <stop offset="1" stopColor="#4F2CFF" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
          </svg>
        </div>
      )}
    </Card>
  );
};

type BgCardProps = {
  label: string;
  value: string;
};

export const BgCard = ({ label, value }: BgCardProps) => {
  return (
    <Card className="border-0 bg-gradient-to-br from-primary to-dark-primary text-white relative flex flex-row items-center gap-4 rounded-md sm:rounded-xl p-4 md:py-6">
      <div className="flex flex-col gap-0">
        <p className="text-primary-light font-semibold text-sm">{label}</p>
        <h5 className="text-white text-lg md:text-2xl font-semibold">
          {value}
        </h5>
      </div>
      <div className="absolute right-4 bottom-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="92"
          height="44"
          fill="none"
          viewBox="0 0 92 44"
        >
          <path
            stroke="url(#paint0_linear_8_210)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M2.5 41.5S8.78-6.005 24.5 16s22 20.995 28 4C59.917-1.007 87.258 17.08 90 2"
          ></path>
          <defs>
            <linearGradient
              id="paint0_linear_8_210"
              x1="-1"
              x2="71.078"
              y1="46.5"
              y2="-16.914"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fff"></stop>
              <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </Card>
  );
};
