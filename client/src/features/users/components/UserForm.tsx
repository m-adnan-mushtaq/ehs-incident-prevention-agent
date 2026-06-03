import ControlledInput from "@/components/form/ControlledInput";
import ControlledSelect from "@/components/form/ControlledSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import type { IRole } from "@/types/role";
import type {
  ICreateUserPayload,
  ICurrentUser,
  IUpdateUserPayload,
  UserRole,
} from "@/types/user";
import { getUserRole } from "@/lib/user-role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toTitleCase } from "@/lib/utils";

const createSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Valid email required."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role_id: z.string().min(1, "Role is required."),
});

const editSchema = z.object({
  name: z.string().min(1, "Name is required."),
  role: z.enum(["admin", "sme", "field_worker"]),
  is_active: z.enum(["true", "false"]),
});

type UserFormProps = {
  roles: IRole[];
  user?: ICurrentUser;
  loading?: boolean;
  onSubmit: (values: ICreateUserPayload | IUpdateUserPayload) => Promise<void>;
  onClose: () => void;
};

const CreateUserForm = ({
  roles,
  loading,
  onSubmit,
  onClose,
}: Omit<UserFormProps, "user">) => {
  const form = useForm({
    resolver: zodResolver(createSchema),
    defaultValues: { name: "", email: "", password: "", role_id: "" },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
          form.reset();
          onClose();
        })}
        className="flex min-w-[320px] flex-col gap-4"
      >
        <ControlledInput name="name" control={form.control} label="Full name" />
        <ControlledInput
          name="email"
          control={form.control}
          label="Email"
          type="email"
        />
        <ControlledInput
          name="password"
          control={form.control}
          label="Temporary password"
          type="password"
        />
        <ControlledSelect
          name="role_id"
          control={form.control}
          label="Role"
          options={roles.map((r) => ({
            label: r.name.replace(/_/g, " "),
            value: r.id,
          }))}
          placeholder="Select role"
        />
        <FormActions
          loading={loading}
          onClose={onClose}
          submitLabel="Add user"
        />
      </form>
    </Form>
  );
};

const EditUserForm = ({
  roles,
  user,
  loading,
  onSubmit,
  onClose,
}: UserFormProps & { user: ICurrentUser }) => {
  const form = useForm({
    resolver: zodResolver(editSchema),
    defaultValues: {
      name: user.name,
      role: (getUserRole(user) ?? "field_worker") as UserRole,
      is_active: user.is_active ? ("true" as const) : ("false" as const),
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit({
            name: values.name,
            role: values.role,
            is_active: values.is_active === "true",
          });
          onClose();
        })}
        className="flex min-w-[320px] flex-col gap-4"
      >
        <ControlledInput name="name" control={form.control} label="Full name" />
        <ControlledSelect
          name="role"
          control={form.control}
          label="Role"
          options={roles.map((r) => ({
            label: toTitleCase(r.name),
            value: r.name,
          }))}
        />
        <ControlledSelect
          name="is_active"
          control={form.control}
          label="Account status"
          options={[
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ]}
        />
        <FormActions
          loading={loading}
          onClose={onClose}
          submitLabel="Update user"
        />
      </form>
    </Form>
  );
};

const FormActions = ({
  loading,
  onClose,
  submitLabel,
}: {
  loading?: boolean;
  onClose: () => void;
  submitLabel: string;
}) => (
  <div className="flex justify-end gap-2 pt-2">
    <Button type="button" variant="outline" onClick={onClose}>
      Cancel
    </Button>
    <Button type="submit" disabled={loading}>
      {loading ? "Saving..." : submitLabel}
    </Button>
  </div>
);

export const UserForm = (props: UserFormProps) =>
  props.user ? (
    <EditUserForm {...props} user={props.user} />
  ) : (
    <CreateUserForm {...props} />
  );
