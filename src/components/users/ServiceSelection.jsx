import React, {useState} from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const ServiceSelection = ({user, setUser, services = [] }) => {

    const handleChange = (event, newSelectedServices) => {
        setUser({
            ...user,
            services: newSelectedServices
        });
    }

    return (
        <Autocomplete
          multiple
          id="services"
          options={services || []}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option, { selected }) => (
            <li key={option.id} {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          style={{ width: 500 }}
          renderInput={(params) => (
            <TextField {...params} label="Asigne los servicios permitidos" placeholder="Servicios" />
          )}
          value={user.services}
          onChange={handleChange}
        />
      );
    };