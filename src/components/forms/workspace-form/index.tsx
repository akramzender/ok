import React from "react";
import { useCreateWorkspace } from "@/hooks/useCreateWorkspace";

import { Button } from "@/components/ui/button";
import FormGenerator from "@/components/global/form-generator";
import Loader from "@/components/global/loader";


const WorkspaceForm = () => {
  const { errors, isPending, onFormSubmit, register } = useCreateWorkspace();

  return (
    <form
      onSubmit={onFormSubmit}
      className="flex flex-col gap-y-2"
    >
      {/* Form Input */}
      <FormGenerator
        register={register}
        name="name"
        placeholder="Workspace Name"
        label="Name"
        errors={errors}
        inputType="input"
        type="text"
      />

      {/* Submit Button */}
      <Button
        className="text-sm w-full mt-2 cursor-pointer bg-amber-50 text-black"
        type="submit"
        disabled={isPending}
      >
        <Loader
          state={isPending}
          className="text-sm w-full items-center justify-center bg-amber-50 cursor-pointer text-black rounded-full"
        >
          Create Workspace
        </Loader>
      </Button>
    </form>
  );
};

export default WorkspaceForm;