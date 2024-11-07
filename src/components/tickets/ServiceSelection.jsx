import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
// Global Imports
import { useGlobalState } from "../../hooks/global/useGlobalState";
import { useNewTicketState } from "../../hooks/global/useNewTicketState";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const ServiceSelection = () => {
  const {
    services,
    queues,  // Make sure queues is imported from useGlobalState
  } = useGlobalState();
  const {selectedServices, selectedQueues, setSelectedServices, setSelectedQueues} = useNewTicketState();


  const handleChange = (event, newSelectedServices) => {
    // Find which service was added/removed by comparing arrays
    const addedServices = newSelectedServices.filter(
      service => !selectedServices.some(s => s.id === service.id)
    );
    
    const removedServices = selectedServices.filter(
      service => !newSelectedServices.some(s => s.id === service.id)
    );

    // Update selected services
    setSelectedServices(newSelectedServices);

    // Handle queues
    if (addedServices.length > 0) {
      // Add corresponding queues for added services
      const newQueues = addedServices.map(service => 
        queues.find(queue => queue.serviceId === service.id)
      ).filter(Boolean); // Filter out any undefined queues

      setSelectedQueues([...selectedQueues, ...newQueues]);
    }

    if (removedServices.length > 0) {
      // Remove queues for removed services
      setSelectedQueues(selectedQueues.filter(
        queue => !removedServices.some(service => service.id === queue.serviceId)
      ));
    }
  };

  return (
    <Autocomplete
      multiple
      id="servicesSelected"
      options={services}
      value={selectedServices}
      onChange={handleChange}
      disableCloseOnSelect
      getOptionLabel={(service) => service.name}
      renderOption={(props, service, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={service.id} {...optionProps}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {service.name}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Agregue los Servicios"
          placeholder="Agregue un servicio"
        />
      )}
    />
  );
};