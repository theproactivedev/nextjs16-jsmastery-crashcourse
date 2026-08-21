"use client";

import * as React from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";

type Option = {
  label: string;
  value: string;
};

type CreatableMultiSelectProps = {
  id?: string;
  options: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  creatable?: boolean;
  ariaInvalid?: boolean;
  ariaDescribedby?: string;
};

const CreatableMultiSelect = ({
  id,
  options: initialOptions,
  value,
  onChange,
  placeholder = "Select or create...",
  creatable = false,
  ariaInvalid = false,
  ariaDescribedby,
}: CreatableMultiSelectProps) => {
  const [options, setOptions] = React.useState<Option[]>(initialOptions);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const existingOption = options.find(
    (option) =>
      option.label.toLowerCase() === search.trim().toLowerCase()
  );

  const canCreate = creatable && search.trim().length > 0 && !existingOption;

  const handleValueChange = (newValues: string[]) => {
    onChange(newValues);
  };

  const handleCreate = () => {
    const label = search.trim();

    if (!label) {
      return;
    }

    // If the option already exists, just select it.
    const existing = options.find(
      (option) =>
        option.label.toLowerCase() === label.toLowerCase()
    );

    if (existing) {
      if (!value.includes(existing.value)) {
        onChange([...value, existing.value]);
      }

      setSearch("");
      return;
    }

    const newOption: Option = {
      label,
      value: label.toLowerCase().replace(/\s+/g, "-"),
    };

    // Add it to the available options
    setOptions((current) => [...current, newOption]);

    // Add it to the form value
    onChange([...value, newOption.value]);

    setSearch("");
  };

  return (
    <Combobox
      id={id}
      items={options}
      multiple
      value={value}
      onValueChange={handleValueChange}
    >
      <ComboboxChips aria-invalid={ariaInvalid} aria-describedby={ariaDescribedby}>
        <ComboboxValue>
          {value.map((value) => {
            const option = options.find(
              (option) => option.value === value
            );

            return (
              <ComboboxChip key={value} 
              className="bg-background text-foreground">
                {option?.label ?? value}
              </ComboboxChip>
            );
          })}
        </ComboboxValue>

        <ComboboxChipsInput
          placeholder={placeholder}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-invalid={ariaInvalid}
        />
      </ComboboxChips>

      <ComboboxContent>
        <ComboboxList>
          {filteredOptions.map((option) => (
            <ComboboxItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </ComboboxItem>
          ))}

          {canCreate && (
            <ComboboxItem
              value={`${search}`}
              onClick={handleCreate}
            >
              Create "{search}"
            </ComboboxItem>
          )}

          {filteredOptions.length === 0 && !canCreate && (
            <ComboboxEmpty>
              No options found.
            </ComboboxEmpty>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export default CreatableMultiSelect;