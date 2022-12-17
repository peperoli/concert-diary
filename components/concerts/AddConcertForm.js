import { useState } from "react"
import supabase from "../../utils/supabase"
import MultiSelect from "../MultiSelect"
import dayjs from "dayjs"
import Button from "../Button"
import { useRouter } from "next/navigation"

export default function NewConcertForm({ bands, locations, setIsOpen, concerts, setConcerts }) {
  const [selectedBands, setSelectedBands] = useState([])
  const [isFestival, setIsFestival] = useState(false)
  const [loading, setLoading] = useState(false)

  const [today] = dayjs().format().split('T')
  const [tomorrow] = dayjs().add(1, 'day').format().split('T')
  const router = useRouter()

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      setLoading(true)
      const { data: concert, error: insertConcertError } = await supabase
        .from('concerts')
        .insert([{
          date_start: event.target.dateStart.value,
          date_end: event.target.dateEnd?.value,
          location: event.target.location.value,
          description: event.target.description.value,
          name: event.target.name.value,
          is_festival: event.target.isFestival.checked,
        }])
        .single()
        .select()

      if (insertConcertError) {
        throw insertConcertError
      }

      const { error: addBandsError } = await supabase
        .from('j_concert_bands')
        .insert(selectedBands.map(band => ({ concert_id: concert?.id, band_id: band.id })))

      if (addBandsError) {
        throw addBandsError
      }

      try {
        const { data: newConcert, error: newConcertError } = await supabase
          .from('concerts')
          .select('*, location(*), bands!j_concert_bands(*)')
          .eq('id', concert.id)
          .single()

        if (newConcertError) {
          throw newConcertError
        }

        setConcerts([
          ...concerts,
          newConcert
        ])
        router.push(`/concerts/${concert.id}`)
      } catch (error) {
        alert(error.message)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <h2>Konzert hinzufügen</h2>
      <div className="form-control">
        <input type="text" name="name" id="name" placeholder="Wacken Open Air" />
        <label htmlFor="name">Name (optional)</label>
      </div>
      <div className="form-control">
        <label>
          <input type="checkbox" name="isFestival" value="isFestival" checked={isFestival} onChange={() => setIsFestival(!isFestival)} />
          <span>Festival</span>
        </label>
      </div>
      <div className="flex gap-4">
        <div className="form-control">
          <input type="date" name="dateStart" id="dateStart" defaultValue={today} />
          <label htmlFor="dateStart">Datum</label>
        </div>
        {isFestival && (
          <div className="form-control">
            <input type="date" name="dateEnd" id="dateEnd" defaultValue={tomorrow} />
            <label htmlFor="dateEnd">Enddatum</label>
          </div>
        )}
      </div>
      <MultiSelect
        name="bands"
        options={bands}
        selectedOptions={selectedBands}
        setSelectedOptions={setSelectedBands}
      />
      <div className="form-control">
        <select name="location" id="location" defaultValue="">
          <option value="" disabled hidden>Bitte wählen ...</option>
          {locations && locations.map(location => (
            <option key={location.id} value={location.id}>{location.name}</option>
            ))}
        </select>
        <label htmlFor="location">Location</label>
      </div>
      <div className="form-control">
        <textarea name="description" id="description" placeholder="Schreib was Schönes ..." />
        <label htmlFor="description">Beschreibung</label>
      </div>
      <div className="sticky bottom-0 flex md:justify-end gap-4 [&>*]:flex-1 py-4 md:pb-0 bg-slate-800 z-10">
        <Button onClick={() => setIsOpen(false)} label="Abbrechen" />
        <Button type="submit" label="Erstellen" style="primary" loading={loading} />
      </div>
    </form>
  )
}