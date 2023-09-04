'use client'

import { AddConcertForm } from './AddConcertForm'
import { ChangeEvent, useState } from 'react'
import { Button } from '../Button'
import {
  ArrowUturnLeftIcon,
  Bars2Icon,
  Bars4Icon,
  ChevronDownIcon,
  GlobeAltIcon,
  PlusIcon,
  UserIcon,
} from '@heroicons/react/20/solid'
import { PageWrapper } from '../layout/PageWrapper'
import { Concert, ExtendedRes, Option } from '../../types/types'
import { useConcerts } from '../../hooks/useConcerts'
import { ConcertCard } from './ConcertCard'
import { BandFilter } from './BandFilter'
import { LocationFilter } from './LocationFilter'
import { YearsFilter } from './YearsFilter'
import { BandCountFilter } from './BandCountFilter'
import Cookies from 'js-cookie'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/useSession'
import { SegmentedControl } from '../controls/SegmentedControl'

type HomePageProps = {
  initialConcerts: ExtendedRes<Concert[]>
}

export const HomePage = ({ initialConcerts }: HomePageProps) => {
  const [size, setSize] = useState(25)
  const [selectedBands, setSelectedBands] = useState<Option[]>([])
  const [selectedLocations, setSelectedLocations] = useState<Option[]>([])
  const [selectedYears, setSelectedYears] = useState<[number, number] | null>(null)
  const [selectedBandsPerConcert, setSelectedBandsPerConcert] = useState<[number, number] | null>(
    null
  )
  const { data: session } = useSession()
  const [view, setView] = useState(Cookies.get('view') ?? 'global')
  const [display, setDisplay] = useState(
    (Cookies.get('display') as 'roomy' | 'compact' | undefined) ?? 'roomy'
  )
  const [sort, setSort] = useState('date_start,desc')
  const { data: concerts, isFetching } = useConcerts(initialConcerts, {
    filter: {
      locations: selectedLocations.map(item => item.id),
      bands: selectedBands.map(item => item.id),
      years: selectedYears,
      bandsPerConcert: selectedBandsPerConcert,
      bandsSeenUser: view === 'user' ? session?.user.id : undefined,
    },
    sort: [sort.split(',')[0], sort.split(',')[1] === 'asc' ? true : false],
    size: size,
  })
  const [isOpen, setIsOpen] = useState(false)
  const { push } = useRouter()
  const pathname = usePathname()

  function handleView(event: ChangeEvent) {
    const target = event.target as HTMLInputElement
    setView(target.value)
    Cookies.set('view', target.value, { expires: 365, sameSite: 'strict' })
  }

  function handleDisplay(event: ChangeEvent) {
    const target = event.target as HTMLInputElement
    setDisplay(target.value as 'roomy' | 'compact')
    Cookies.set('display', target.value, { expires: 365, sameSite: 'strict' })
  }

  function resetAll() {
    setSelectedBands([])
    setSelectedLocations([])
    setSelectedYears(null)
    setSelectedBandsPerConcert(null)
  }
  return (
    <PageWrapper>
      <main className="container">
        <div className="md:hidden fixed bottom-0 right-0 m-4">
          <Button
            onClick={session ? () => setIsOpen(true) : () => push(`/login?redirect=${pathname}`)}
            label="Konzert hinzufügen"
            style="primary"
            contentType="icon"
            icon={<PlusIcon className="h-icon" />}
          />
        </div>
        <div className="sr-only md:not-sr-only flex justify-between items-center mb-6">
          <h1>Konzerte</h1>
          <Button
            onClick={session ? () => setIsOpen(true) : () => push(`/login?redirect=${pathname}`)}
            label="Konzert hinzufügen"
            style="primary"
            icon={<PlusIcon className="h-icon" />}
            className="hidden md:block"
          />
        </div>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="my-1.5 text-sm text-slate-300">{concerts?.count}&nbsp;Einträge</div>
            {(selectedBands.length > 0 ||
              selectedLocations.length > 0 ||
              selectedYears ||
              selectedBandsPerConcert) && (
              <Button
                label="Zurücksetzen"
                onClick={resetAll}
                icon={<ArrowUturnLeftIcon className="h-icon" />}
                size="small"
              />
            )}
          </div>
          <div className="flex md:grid md:grid-cols-2 gap-2 md:gap-4 -mx-4 px-4 overflow-x-auto md:overflow-visible scrollbar-hidden">
            <BandFilter selectedOptions={selectedBands} setSelectedOptions={setSelectedBands} />
            <LocationFilter
              selectedOptions={selectedLocations}
              setSelectedOptions={setSelectedLocations}
            />
            <YearsFilter selectedOptions={selectedYears} setSelectedOptions={setSelectedYears} />
            <BandCountFilter
              selectedOptions={selectedBandsPerConcert}
              setSelectedOptions={setSelectedBandsPerConcert}
            />
          </div>
          <div className="flex items-center gap-4 -mx-4 px-4 overflow-x-auto scrollbar-hidden">
            {session && (
              <SegmentedControl
                options={[
                  { value: 'global', label: 'Alle', icon: <GlobeAltIcon className="h-icon" /> },
                  { value: 'user', label: 'Gesehene', icon: <UserIcon className="h-icon" /> },
                ]}
                value={view}
                onValueChange={handleView}
              />
            )}
            {session && (
              <SegmentedControl
                options={[
                  { value: 'roomy', label: 'Geräumig', icon: <Bars2Icon className="h-icon" /> },
                  { value: 'compact', label: 'Kompakt', icon: <Bars4Icon className="h-icon" /> },
                ]}
                value={display}
                onValueChange={handleDisplay}
                iconOnly
              />
            )}
            <div className="flex items-center ml-auto text-sm">
              <label htmlFor="sortBy" className="sr-only md:not-sr-only text-slate-300">
                Sortieren nach:
              </label>
              <div className="relative flex items-center">
                <select
                  onChange={e => setSort(e.target.value)}
                  name="sortBy"
                  id="sortBy"
                  className="pl-2 pr-7 py-1 rounded-md hover:bg-slate-800 bg-transparent appearance-none"
                >
                  <option value="date_start,desc">Neuste</option>
                  <option value="date_start,asc">Älteste</option>
                </select>
                <ChevronDownIcon className="absolute right-2 text-xs h-icon pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            {concerts?.data.map(concert => (
              <ConcertCard concert={concert} display={display} key={concert.id} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-slate-300">
              {concerts?.data.length} von {concerts?.count} Einträgen
            </p>
            {concerts?.data.length !== concerts?.count && (
              <Button
                label="Mehr anzeigen"
                onClick={() => setSize(prev => (prev += 25))}
                loading={isFetching}
                style="primary"
              />
            )}
          </div>
        </div>
      </main>
      <AddConcertForm isOpen={isOpen} setIsOpen={setIsOpen} />
    </PageWrapper>
  )
}
