import { useEffect, useState } from 'react'
import { FilterButton } from './../FilterButton'
import { MultiSelect } from './../MultiSelect'
import { useLocations } from './../../hooks/locations/useLocations'

type LocationMultiSelectProps = {
  selectedOptions: number[]
  setSelectedOptions: (value: number[]) => void
}

const LocationMultiSelect = ({ selectedOptions, setSelectedOptions }: LocationMultiSelectProps) => {
  const { data: locations, isLoading } = useLocations()
  return (
    <div className="relative h-full">
      <MultiSelect
        name="locations"
        options={locations?.data}
        isLoading={isLoading}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        alwaysOpen
        fullHeight
      />
    </div>
  )
}

type LocationFilterProps = {
  values: number[] | null
  onSubmit: (value: number[]) => void
}

export const LocationFilter = ({ values: submittedValues, onSubmit }: LocationFilterProps) => {
  const { data: locations } = useLocations(null, { filter: { ids: submittedValues } })
  const [selectedIds, setSelectedIds] = useState(submittedValues ?? [])

  useEffect(() => {
    setSelectedIds(submittedValues ?? [])
  }, [submittedValues])
  return (
    <FilterButton
      label="Locations"
      items={locations?.data}
      selectedIds={selectedIds}
      submittedValues={submittedValues}
      onSubmit={onSubmit}
    >
      <LocationMultiSelect selectedOptions={selectedIds} setSelectedOptions={setSelectedIds} />
    </FilterButton>
  )
}
