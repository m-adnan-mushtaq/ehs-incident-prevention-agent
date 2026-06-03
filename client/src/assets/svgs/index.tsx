type DashboardIconProps = React.SVGProps<SVGSVGElement> & {
  fillPath: string;
};

export const DashboardSvg = ({ fillPath, ...props }: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M18.32 12c2.6 0 3.68-1 2.72-4.28-.65-2.21-2.55-4.11-4.76-4.76C13 2 12 3.08 12 5.68v2.88C12 11 13 12 15 12z"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M20 14.7a9.09 9.09 0 0 1-10.42 7.17c-3.79-.61-6.84-3.66-7.46-7.45A9.1 9.1 0 0 1 9.26 4.01"
    ></path>
  </svg>
);

export const GovernanceSvg = ({ fillPath, ...props }: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M10.11 11.15H7.46c-.63 0-1.14.51-1.14 1.14v5.12h3.79z"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M12.761 6.6h-1.52c-.63 0-1.14.51-1.14 1.14v9.66h3.79V7.74c0-.63-.5-1.14-1.13-1.14M16.548 12.85h-2.65v4.55h3.79v-3.41c-.01-.63-.52-1.14-1.14-1.14"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7"
    ></path>
  </svg>
);

export const RolesSvg = ({ fillPath, ...props }: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    fill="none"
    viewBox="0 0 25 24"
    {...props}
  >
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m3.67 7.439 8.83 5.11 8.77-5.08M12.5 21.61v-9.07"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M10.43 2.48 5.09 5.44c-1.21.67-2.2 2.35-2.2 3.73v5.65c0 1.38.99 3.06 2.2 3.73l5.34 2.97c1.14.63 3.01.63 4.15 0l5.34-2.97c1.21-.67 2.2-2.35 2.2-3.73V9.17c0-1.38-.99-3.06-2.2-3.73l-5.34-2.97c-1.15-.63-3.01-.63-4.15.01"
    ></path>
  </svg>
);

export const DecisionSvg = ({ fillPath, ...props }: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="24"
    fill="none"
    viewBox="0 0 25 24"
    {...props}
  >
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M18.54 13.55c-.42.41-.66 1-.6 1.63.09 1.08 1.08 1.87 2.16 1.87H22v1.19c0 2.07-1.69 3.76-3.76 3.76H6.76C4.69 22 3 20.31 3 18.24v-6.73c0-2.07 1.69-3.76 3.76-3.76h11.48c2.07 0 3.76 1.69 3.76 3.76v1.44h-2.02c-.56 0-1.07.22-1.44.6"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M3 12.41V7.84c0-1.19.73-2.25 1.84-2.67l7.94-3a1.9 1.9 0 0 1 2.57 1.78v3.8M23.059 13.97v2.06c0 .55-.44 1-1 1.02h-1.96c-1.08 0-2.07-.79-2.16-1.87-.06-.63.18-1.22.6-1.63.37-.38.88-.6 1.44-.6h2.08c.56.02 1 .47 1 1.02M7.5 12h7"
    ></path>
  </svg>
);
export const QuestionSvg = ({ fillPath, ...props }: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m18.47 16.83.39 3.16c.1.83-.79 1.41-1.5.98l-4.19-2.49q-.69 0-1.35-.09A4.86 4.86 0 0 0 13 15.23c0-2.84-2.46-5.14-5.5-5.14-1.16 0-2.23.33-3.12.91-.03-.25-.04-.5-.04-.76C4.34 5.69 8.29 2 13.17 2S22 5.69 22 10.24c0 2.7-1.39 5.09-3.53 6.59"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M13 15.23c0 1.19-.44 2.29-1.18 3.16-.99 1.2-2.56 1.97-4.32 1.97l-2.61 1.55c-.44.27-1-.1-.94-.61l.25-1.97C2.86 18.4 2 16.91 2 15.23c0-1.76.94-3.31 2.38-4.23.89-.58 1.96-.91 3.12-.91 3.04 0 5.5 2.3 5.5 5.14"
    ></path>
  </svg>
);

export const RequestSvg = ({ fillPath, ...props }: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-5 5H8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15.695 13.7h.009M15.695 16.7h.009M11.996 13.7h.008M11.996 16.7h.008M8.294 13.7h.01M8.294 16.7h.01"
    ></path>
  </svg>
);

export const NotesSvg = ({ fillPath, ...props }: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill={fillPath}
      d="M8 5.75c-.41 0-.75-.34-.75-.75V2c0-.41.34-.75.75-.75s.75.34.75.75v3c0 .41-.34.75-.75.75M16 5.75c-.41 0-.75-.34-.75-.75V2c0-.41.34-.75.75-.75s.75.34.75.75v3c0 .41-.34.75-.75.75M15 11.75H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h8c.41 0 .75.34.75.75s-.34.75-.75.75M12 15.75H7c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5c.41 0 .75.34.75.75s-.34.75-.75.75"
    ></path>
    <path
      fill={fillPath}
      d="M15 22.75H9c-5.62 0-6.75-2.65-6.75-6.93V9.65c0-4.74 1.6-6.67 5.71-6.9H16c4.15.23 5.75 2.16 5.75 6.9V16c0 .41-.34.75-.75.75s-.75-.34-.75-.75V9.65c0-4.36-1.45-5.24-4.29-5.4H8c-2.8.16-4.25 1.04-4.25 5.4v6.17c0 3.83.73 5.43 5.25 5.43h6c.41 0 .75.34.75.75s-.34.75-.75.75"
    ></path>
    <path
      fill={fillPath}
      d="M15 22.75a.753.753 0 0 1-.75-.75v-3c0-2.42 1.33-3.75 3.75-3.75h3c.3 0 .58.18.69.46.12.28.05.6-.16.82l-6 6a.75.75 0 0 1-.53.22m3-6c-1.58 0-2.25.67-2.25 2.25v1.19l3.44-3.44z"
    ></path>
  </svg>
);
export const SettingSvg = ({ fillPath, ...props }: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill={fillPath}
      d="M12 15.75c-2.07 0-3.75-1.68-3.75-3.75S9.93 8.25 12 8.25s3.75 1.68 3.75 3.75-1.68 3.75-3.75 3.75m0-6c-1.24 0-2.25 1.01-2.25 2.25s1.01 2.25 2.25 2.25 2.25-1.01 2.25-2.25S13.24 9.75 12 9.75"
    ></path>
    <path
      fill={fillPath}
      d="M15.21 22.19c-.21 0-.42-.03-.63-.08-.62-.17-1.14-.56-1.47-1.11l-.12-.2c-.59-1.02-1.4-1.02-1.99 0l-.11.19c-.33.56-.85.96-1.47 1.12-.63.17-1.28.08-1.83-.25l-1.72-.99a2.65 2.65 0 0 1-.98-3.62c.29-.51.37-.97.2-1.26s-.6-.46-1.19-.46c-1.46 0-2.65-1.19-2.65-2.65v-1.76c0-1.46 1.19-2.65 2.65-2.65.59 0 1.02-.17 1.19-.46s.1-.75-.2-1.26c-.35-.61-.44-1.33-.26-2.01.18-.69.62-1.26 1.24-1.61l1.73-.99c1.13-.67 2.62-.28 3.3.87l.12.2c.59 1.02 1.4 1.02 1.99 0l.11-.19c.68-1.16 2.17-1.55 3.31-.87l1.72.99a2.65 2.65 0 0 1 .98 3.62c-.29.51-.37.97-.2 1.26s.6.46 1.19.46c1.46 0 2.65 1.19 2.65 2.65v1.76c0 1.46-1.19 2.65-2.65 2.65-.59 0-1.02.17-1.19.46s-.1.75.2 1.26c.35.61.45 1.33.26 2.01a2.58 2.58 0 0 1-1.24 1.61l-1.73.99c-.38.21-.79.32-1.21.32M12 18.49c.89 0 1.72.56 2.29 1.55l.11.19c.12.21.32.36.56.42s.48.03.68-.09l1.73-1a1.157 1.157 0 0 0 .43-1.57c-.57-.98-.64-1.99-.2-2.76s1.35-1.21 2.49-1.21c.64 0 1.15-.51 1.15-1.15v-1.76c0-.63-.51-1.15-1.15-1.15-1.14 0-2.05-.44-2.49-1.21s-.37-1.78.2-2.76c.15-.26.19-.57.11-.87s-.27-.54-.53-.7l-1.73-.99a.92.92 0 0 0-1.26.33l-.11.19c-.57.99-1.4 1.55-2.29 1.55s-1.72-.56-2.29-1.55l-.11-.2a.92.92 0 0 0-1.24-.32l-1.73 1A1.157 1.157 0 0 0 6.19 6c.57.98.64 1.99.2 2.76S5.04 9.97 3.9 9.97c-.64 0-1.15.51-1.15 1.15v1.76c0 .63.51 1.15 1.15 1.15 1.14 0 2.05.44 2.49 1.21s.37 1.78-.2 2.76c-.15.26-.19.57-.11.87s.27.54.53.7l1.73.99c.21.13.46.16.69.1.24-.06.44-.22.57-.43l.11-.19c.57-.98 1.4-1.55 2.29-1.55"
    ></path>
  </svg>
);

export const CalendarDottedSvg = ({
  fillPath,
  ...props
}: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="27"
    fill="none"
    viewBox="0 0 25 27"
    {...props}
  >
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M8.333 2.25v3.375M16.667 2.25v3.375M3.646 10.226h17.708M21.875 9.563v9.562c0 3.375-1.562 5.625-5.208 5.625H8.333c-3.645 0-5.208-2.25-5.208-5.625V9.563c0-3.376 1.563-5.626 5.208-5.626h8.334c3.645 0 5.208 2.25 5.208 5.626"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12.495 15.413h.01M8.64 15.413h.01M8.64 18.788h.01"
    ></path>
  </svg>
);

export const HelpCenterSvg = ({ fillPath, ...props }: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="27"
    fill="none"
    viewBox="0 0 25 27"
    {...props}
  >
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M17.708 20.734h-4.166l-4.636 3.33c-.687.495-1.614-.034-1.614-.934v-2.396c-3.125 0-5.209-2.25-5.209-5.625v-6.75c0-3.375 2.084-5.625 5.209-5.625h10.416c3.125 0 5.209 2.25 5.209 5.625v6.75c0 3.375-2.084 5.625-5.209 5.625"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12.5 12.78v-.236c0-.765.438-1.17.875-1.496.427-.315.854-.72.854-1.463 0-1.035-.77-1.867-1.729-1.867-.958 0-1.73.832-1.73 1.867M12.495 15.469h.01"
    ></path>
  </svg>
);

export const NotificationBellSvg = ({
  fillPath,
  ...props
}: DashboardIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="27"
    fill="none"
    viewBox="0 0 25 27"
    {...props}
  >
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M12.52 3.274c-3.447 0-6.25 3.026-6.25 6.75v3.25c0 .687-.27 1.733-.593 2.318l-1.198 2.15c-.74 1.327-.229 2.8 1.125 3.295a20.27 20.27 0 0 0 13.823 0c1.26-.45 1.813-2.058 1.125-3.296l-1.198-2.149c-.312-.585-.583-1.63-.583-2.317v-3.251c0-3.713-2.813-6.75-6.25-6.75Z"
    ></path>
    <path
      stroke={fillPath}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M14.448 3.6a6.534 6.534 0 0 0-3.854 0c.302-.832 1.052-1.417 1.927-1.417s1.625.585 1.927 1.417"
    ></path>
    <path
      stroke={fillPath}
      strokeMiterlimit="10"
      strokeWidth="1.5"
      d="M15.646 21.442c0 1.857-1.406 3.375-3.125 3.375-.854 0-1.646-.382-2.209-.99a3.53 3.53 0 0 1-.916-2.385"
    ></path>
    <circle cx="18" cy="4" r="3" fill="#D8727D"></circle>
  </svg>
);

export const UpSvg = ({
  fill,
  ...props
}: {
  fill: string;
} & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="6"
    height="5"
    fill="none"
    viewBox="0 0 6 5"
    {...props}
  >
    <path
      fill={fill}
      d="M2.435.185c-.03.028-.154.135-.256.234C1.539 1 .488 2.52.168 3.317c-.052.12-.161.426-.168.589q0 .234.109.448c.102.177.263.32.452.397.131.05.525.128.532.128.43.078 1.13.121 1.903.121.736 0 1.408-.043 1.844-.107.008-.007.497-.085.664-.17A.89.89 0 0 0 6 3.934v-.028c-.008-.213-.197-.66-.205-.66-.32-.753-1.319-2.238-1.982-2.834 0 0-.171-.168-.278-.242A.9.9 0 0 0 3.004 0a.94.94 0 0 0-.569.185"
    ></path>
  </svg>
);
export const DownSvg = ({
  fill,
  ...props
}: {
  fill: string;
} & React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="6"
    height="5"
    fill="none"
    viewBox="0 0 6 5"
    {...props}
  >
    <path
      fill={fill}
      d="M2.435 4.815c-.03-.028-.154-.135-.256-.234C1.539 4 .488 2.48.168 1.683.115 1.563.006 1.257 0 1.094Q0 .86.109.646A.94.94 0 0 1 .561.25 5 5 0 0 1 1.093.12C1.523.043 2.223 0 2.996 0c.736 0 1.408.043 1.844.107.008.007.497.085.664.17A.89.89 0 0 1 6 1.066v.028c-.008.213-.197.66-.205.66-.32.753-1.319 2.238-1.982 2.834 0 0-.171.168-.278.242a.9.9 0 0 1-.532.17.94.94 0 0 1-.569-.185"
    ></path>
  </svg>
);

export const MeshSVg = () => {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
};
