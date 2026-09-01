import { SearchIcon, XIcon } from "lucide-react";
import { useId } from "react";

import { Button } from "./button";
import { Input } from "./input";

export default function CollectionFilter({ label, onChange, value }) {
  const inputId = useId();

  return (
    <div className="collection-filter">
      <div className="collection-filter__control">
        <SearchIcon aria-hidden="true" />
        <label className="sr-only" htmlFor={inputId}>{label}</label>
        <Input
          id={inputId}
          type="search"
          value={value}
          placeholder={label}
          autoComplete="off"
          onChange={(event) => onChange(event.target.value)}
        />
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Clear filter"
            onClick={() => onChange("")}
          >
            <XIcon aria-hidden="true" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
