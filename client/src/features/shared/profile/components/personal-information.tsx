import ControlledCombobox from "@/components/form/ControlledAutoComplete";
import ControlledInput from "@/components/form/ControlledInput";
import ControlledSelect from "@/components/form/ControlledSelect";
import ControlledTextArea from "@/components/form/ControlledTextArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { COUNTRY_LOOKUP, COUNTRY_OPTIONS } from "@/constants/common";
import { getUserAvatar, showMutationError } from "@/helpers/common";
import {
  IProfileSchema,
  profileSchema,
} from "@/lib/validation/auth.validation";
import { authService } from "@/services";
import { useAuthStore } from "@/store/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const genderOptions = [
  {
    label: "Male",
    value: "M",
  },
  {
    label: "Female",
    value: "F",
  },
];

const PersonalInformation = () => {
  const form = useForm<IProfileSchema>({
    resolver: zodResolver(profileSchema),
  });

  const { user, updateUser } = useAuthStore();

  const [profilePicture, setProfilePicture] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  //api calls
  const { mutateAsync, isPending } = useMutation({
    mutationFn: authService.updateAccountInformation,
  });

  useEffect(() => {
    if (user) {
      form.setValue("gender", user.gender);
      form.setValue("about_me", user.about_me);
      form.setValue("phone_number", user.phone_number);
      if (user?.profile_photo) {
        setProfilePicture(getUserAvatar(user?.profile_photo));
      }
      form.setValue("city", user?.city);
      if (user?.country) {
        form.setValue("country", COUNTRY_LOOKUP[user?.country]);
      }
    }
  }, [user]);

  const handleSubmit = async (data: IProfileSchema) => {
    try {
      console.log(data);
      let formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (!value) return;
        formData.append(key, value);
      });
      const result = await mutateAsync(formData);
      if (!result?.data?.profile) return;
      updateUser(result.data?.profile);
      toast.success("Profile updated successfully");
    } catch (error) {
      showMutationError(error);
    }
  };

  return (
    <>
      <h3 className="font-semibold mb-4 text-xl">Personal Information</h3>
      <Form {...form}>
        <form
          noValidate
          autoComplete="nope"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-cols-2 gap-2 md:gap-4 w-full"
        >
          <div className="col-span-2 ">
            <FormField
              control={form.control}
              name="profile_photo"
              render={({ field: { onChange } }) => (
                <FormItem className="mx-auto">
                  <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
                    <div
                      onClick={() => {
                        fileInputRef?.current?.click();
                      }}
                      className="relative"
                    >
                      <Avatar className="w-24 h-24 border">
                        <AvatarImage
                          src={profilePicture || ""}
                          alt="Profile picture"
                        />
                        <AvatarFallback className="bg-muted">
                          <User className="w-12 h-12 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>

                      {profilePicture && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={(event) => {
                            event.stopPropagation();
                            //   setIsAvatarChanged(true);
                            setProfilePicture(undefined);
                            onChange(null); // Clear form state
                            form.setValue("profile_photo", null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ""; // Clear input field manually
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef} // Assign ref to the input
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // setIsAvatarChanged(true);
                            setProfilePicture(URL.createObjectURL(file));
                            onChange(file); // Pass only the file, not event
                          }
                        }}
                        className="hidden"
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <ControlledSelect
            control={form.control}
            name="gender"
            label="Gender"
            options={genderOptions}
          />
          <ControlledInput
            control={form.control}
            name="phone_number"
            label="Phone Number"
          />
          <ControlledInput control={form.control} name="city" label="City" />
          <ControlledCombobox
            control={form.control}
            name="country"
            label="Country"
            options={COUNTRY_OPTIONS}
          />
          <div className="col-span-2">
            <ControlledTextArea
              control={form.control}
              name="about_me"
              label="About Me"
            />
          </div>
          <div className="col-span-2 text-right">
            <Button disabled={isPending} type="submit">
              {isPending ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PersonalInformation;
