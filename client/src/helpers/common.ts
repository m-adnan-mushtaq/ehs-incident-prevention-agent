import { BACKEND_URL } from "@/constants/common";
import { IPermission } from "@/services/governance/permission.service";
import { AxiosError } from "axios";
import { differenceInDays, format } from "date-fns";
import toast from "react-hot-toast";
import { matchPath } from "react-router";

export const isLinkActive = (pathname: string, link: string): boolean => {
  // const linkParts = link.split("/").filter(Boolean);
  // const pathParts = pathname.split("/").filter(Boolean);

  // if (linkParts.length > pathParts.length) return false;

  // // return linkParts.every((part, i) => part === pathParts[i]);
  return link === pathname;
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const groupBy = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T[]> => {
  return array.reduce((result, currentValue) => {
    const groupKey = currentValue[key] as unknown as string;
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentValue);
    return result;
  }, {} as Record<string, T[]>);
};

export const arrayToLookup = <T, K extends keyof T>(
  array: T[],
  key: K
): Record<string, T> => {
  return array.reduce((result, currentValue) => {
    const groupKey = currentValue[key] as unknown as string;
    result[groupKey] = currentValue;
    return result;
  }, {} as Record<string, T>);
};

export const isPathActive = (
  currentPath: string,
  basePath: string
): boolean => {
  let result = matchPath(currentPath, basePath);
  return Boolean(result);
};

export const removeTrailingSlash = (str: string) => {
  return str.endsWith("/") ? str.slice(0, -1) : str;
};

export const extractDjangoErrorMessages = (
  data: Record<string, any>
): string => {
  if (
    Array.isArray(data.non_field_errors) &&
    data.non_field_errors.length > 0
  ) {
    return data.non_field_errors.join(" ");
  }
  const messages: string[] = [];

  for (const [field, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      const readableField = field.replace(/_/g, " ");
      messages.push(`${capitalize(readableField)}: ${value.join(" ")}`);
    }
  }
  if (messages.length === 0) {
    return "An unknown error occurred.";
  }

  return messages.join(" ");
};

const capitalize = (str: string): string => {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

export const showMutationError = (error: any) => {
  let message = "Something went wrong. Please try again.";
  try {
    if (error instanceof Error) {
      message = error.message;
    }
    // Handle Axios errors with Django-style response
    if (error instanceof AxiosError) {
      const data = error.response?.data;
      if (typeof data === "string") {
        message = data;
      } else if (typeof data === "object" && data !== null) {
        message = extractDjangoErrorMessages(data);
      }
    }
  } catch (e) {
    console.error("Failed to parse error:", e);
  }

  toast.error(message);
};

export const getUserAvatar = (avatarUrl?: string) => {
  if (!avatarUrl) return;
  const baseUrl = new URL(BACKEND_URL).origin;
  return avatarUrl?.startsWith("http") ? avatarUrl : `${baseUrl}${avatarUrl}`;
};
export const toTitleCase = (str: string = "") => {
  return str
    .replace(/_|-/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    );
};

export function generatePermissionStrings(
  permissions: IPermission[]
): string[] {
  const entityActions: Record<string, string[]> = {};

  // Group actions by entity
  permissions.forEach((permission) => {
    const [action, entity] = permission.name.split(":");
    if (!entityActions[entity]) {
      entityActions[entity] = [];
    }
    entityActions[entity].push(action);
  });

  // Map action keywords to human-readable labels
  const actionMap: Record<string, string> = {
    view: "View",
    add: "Create",
    edit: "Edit",
    approve: "Approve",
    remove: "Remove",
  };

  // Generate readable strings
  return Object.entries(entityActions).map(([entity, actions]) => {
    const readableActions = actions
      .map((action) => actionMap[action] || action)
      .join(", ");
    return `${readableActions} ${toTitleCase(entity)}`;
  });
}

export const getDueStatus = (endDate: string | Date) => {
  const today = new Date();
  const end = new Date(endDate);

  const daysLeft = differenceInDays(end, today);

  let isExpired = false;
  let statusLabel = "";

  if (daysLeft > 0) {
    statusLabel = `Due in ${daysLeft} day(s)`;
  } else if (daysLeft === 0) {
    statusLabel = "Due today";
  } else {
    isExpired = true;
    statusLabel = `Overdue by ${Math.abs(daysLeft)} day(s)`;
  }

  return { isExpired, statusLabel };
};

export const formatDateTime = (str: string | Date) => {
  return format(new Date(str), "dd/MM/yyyy hh:mm aa");
};

export const formatApiDate = (str: string | Date) => {
  return format(new Date(str), "yyyy-MM-dd");
};

export const slugify = (str: string) => {
  return str
    .normalize("NFD") // Normalize to decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters
    .trim() // Remove leading and trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .toLowerCase(); // Convert to lowercase
};
