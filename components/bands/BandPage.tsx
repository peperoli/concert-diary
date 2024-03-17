'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import { PageWrapper } from '../layout/PageWrapper'
import { Button } from '../Button'
import { ConcertCard } from '../concerts/ConcertCard'
import { Band } from '../../types/types'
import { useBand } from '../../hooks/bands/useBand'
import { useConcerts } from '../../hooks/concerts/useConcerts'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '../../hooks/auth/useSession'
import { parseAsStringLiteral, useQueryState } from 'nuqs'
import { modalPaths } from '../shared/ModalProvider'
import { ArrowLeft, Edit, MapPin, MusicIcon, Trash, Youtube } from 'lucide-react'
import Image from 'next/image'
import { useSpotifyArtist } from '@/hooks/spotify/useSpotifyArtist'

export interface BandPageProps {
  initialBand: Band
  bandQueryState?: string
}

export const BandPage = ({ initialBand, bandQueryState }: BandPageProps) => {
  const { data: band, isLoading: bandIsLoading } = useBand(initialBand.id, initialBand)
  const { data: concerts } = useConcerts(undefined, {
    bands: [initialBand.id],
    sort: { sort_by: 'date_start', sort_asc: false },
  })
  const { data: spotifyArtist } = useSpotifyArtist(band?.spotify_artist_id)
  const [_, setModal] = useQueryState(
    'modal',
    parseAsStringLiteral(modalPaths).withOptions({ history: 'push' })
  )
  const { data: session } = useSession()
  const { push } = useRouter()
  const pathname = usePathname()
  const regionNames = new Intl.DisplayNames('de', { type: 'region' })

  if (bandIsLoading) {
    return (
      <PageWrapper>
        <p>Lade...</p>
      </PageWrapper>
    )
  }

  if (!band) {
    return (
      <PageWrapper>
        <p>Band nicht gefunden</p>
      </PageWrapper>
    )
  }
  return (
    <PageWrapper>
      <main className="container grid gap-4">
        <div className="flex items-center justify-between">
          <Link href={`/bands${bandQueryState ?? ''}`} className="btn btn-small btn-tertiary">
            <ArrowLeft className="size-icon" />
            Zurück zur Übersicht
          </Link>
          <div className="flex gap-3">
            <Button
              onClick={
                session ? () => setModal('edit-band') : () => push(`/login?redirect=${pathname}`)
              }
              label="Bearbeiten"
              icon={<Edit className="size-icon" />}
              contentType="icon"
              size="small"
              appearance="tertiary"
            />
            <Button
              onClick={
                session ? () => setModal('delete-band') : () => push(`/login?redirect=${pathname}`)
              }
              label="Löschen"
              icon={<Trash className="size-icon" />}
              contentType="icon"
              danger
              size="small"
              appearance="tertiary"
            />
          </div>
        </div>
        <section className="flex gap-5 rounded-2xl bg-radial-gradient from-blue/20 p-6">
          <div className="relative size-56">
            {spotifyArtist?.images[0] && (
              <Image
                src={spotifyArtist.images[0].url}
                alt={band.name}
                fill
                className="rounded-lg object-cover"
              />
            )}
          </div>
          <div>
            <h1>{band.name}</h1>
            {band.country && (
              <div className="mb-2 flex items-center gap-4">
                <MapPin className="h-icon text-slate-300" />
                {regionNames.of(band.country.iso2)}
              </div>
            )}
            <div className="mb-5 flex items-center gap-4">
              <MusicIcon className="h-icon text-slate-300" />
              <ul className="flex flex-wrap gap-x-2">
                {band.genres &&
                  band.genres.map((genre, index) => (
                    <Fragment key={index}>
                      <li>{genre.name}</li>
                      {index + 1 !== band.genres?.length && <span>&bull;</span>}
                    </Fragment>
                  ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2">
              {band.youtube_url && (
                <Link
                  href={band.youtube_url}
                  target="_blank"
                  className="btn btn-small btn-secondary"
                >
                  YouTube
                </Link>
              )}
              {spotifyArtist && (
                <Link
                  href={spotifyArtist.external_urls.spotify}
                  target="_blank"
                  className="btn btn-small btn-secondary"
                >
                  Spotify
                </Link>
              )}
            </div>
          </div>
        </section>
        {concerts?.data && concerts?.data?.length > 0 && (
          <div className="grid gap-4 p-6">
            <h2 className="mb-0 text-slate-300">Konzerte mit {band.name}</h2>
            {concerts?.data.map(item => <ConcertCard key={item.id} concert={item} />)}
          </div>
        )}
      </main>
    </PageWrapper>
  )
}
