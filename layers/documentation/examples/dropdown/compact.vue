<template>
  <div class="flex items-end">
    <BaseDropdown
      flavor="button"
      label="Dropdown"
      orientation="start"
      condensed
    >
      <BaseDropdownItem
        to="#"
        title="Profile"
        text="View your profile"
      />

      <BaseDropdownItem
        to="#"
        title="Projects"
        text="View your projects"
      />

      <BaseDropdownItem
        to="#"
        title="Team"
        text="Manage your team"
      />

      <BaseDropdownItem
        to="#"
        title="Settings"
        text="Set your preferences"
      />
    </BaseDropdown>
  </div>
</template>
