import { createSignal, Show, onCleanup } from 'solid-js';
import CountrySelector from './components/CountrySelector';
import StationList from './components/StationList';
import StationDetails from './components/StationDetails';
import stringSimilarity from 'string-similarity';

function App() {
  const [stations, setStations] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [currentCountry, setCurrentCountry] = createSignal(null);
  const [currentPlayingStation, setCurrentPlayingStation] = createSignal(null);
  const [selectedStation, setSelectedStation] = createSignal(null);
  const [selectedStationIndex, setSelectedStationIndex] = createSignal(null);
  const [audio, setAudio] = createSignal(null);

  const arabCountries = [
    { name: 'مصر', code: 'Egypt' },
    { name: 'السعودية', code: 'Saudi Arabia' },
    { name: 'الإمارات', code: 'United Arab Emirates' },
    { name: 'الكويت', code: 'Kuwait' },
    { name: 'قطر', code: 'Qatar' },
    { name: 'البحرين', code: 'Bahrain' },
    { name: 'عمان', code: 'Oman' },
    { name: 'اليمن', code: 'Yemen' },
    { name: 'العراق', code: 'Iraq' },
    { name: 'سوريا', code: 'Syria' },
    { name: 'لبنان', code: 'Lebanon' },
    { name: 'الأردن', code: 'Jordan' },
    { name: 'فلسطين', code: 'Palestine' },
    { name: 'ليبيا', code: 'Libya' },
    { name: 'السودان', code: 'Sudan' },
    { name: 'المغرب', code: 'Morocco' },
    { name: 'الجزائر', code: 'Algeria' },
    { name: 'تونس', code: 'Tunisia' },
    { name: 'موريتانيا', code: 'Mauritania' },
    { name: 'جيبوتي', code: 'Djibouti' },
    { name: 'الصومال', code: 'Somalia' },
    { name: 'جزر القمر', code: 'Comoros' },
  ];

  const fetchStations = async (countryCode) => {
    if (loading()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(
          countryCode
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        // استبعاد المحطات غير الشغالة
        const validStations = data.filter((station) => station.lastcheckok === 1);
        // إزالة المحطات المتشابهة
        const uniqueStations = [];
        validStations.forEach((station) => {
          const isSimilar = uniqueStations.some(
            (uniqueStation) =>
              stringSimilarity.compareTwoStrings(uniqueStation.name, station.name) > 0.8
          );
          if (!isSimilar) {
            uniqueStations.push(station);
          }
        });
        setStations(uniqueStations);
      } else {
        console.error('Error fetching stations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching stations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStations = () => stations();

  const selectCountry = (country) => {
    setCurrentCountry(country);
    setCurrentPlayingStation(null);
    setSelectedStation(null);
    setSelectedStationIndex(null);
    setStations([]);
    fetchStations(country.code);
  };

  function playStation(station) {
    if (loading()) return;
    // Stop any currently playing audio
    if (audio()) {
      audio().pause();
      audio().currentTime = 0;
    }

    const newAudio = new Audio(station.url_resolved);
    newAudio.loop = true;
    newAudio.play();
    setAudio(newAudio);
    setCurrentPlayingStation(station);
  }

  function stopStation() {
    if (audio()) {
      audio().pause();
      audio().currentTime = 0;
      setAudio(null);
      setCurrentPlayingStation(null);
    }
  }

  function previousStation() {
    if (selectedStationIndex() > 0) {
      const index = selectedStationIndex() - 1;
      const station = filteredStations()[index];
      setSelectedStation(station);
      setSelectedStationIndex(index);
      playStation(station);
    }
  }

  function nextStation() {
    if (selectedStationIndex() < filteredStations().length - 1) {
      const index = selectedStationIndex() + 1;
      const station = filteredStations()[index];
      setSelectedStation(station);
      setSelectedStationIndex(index);
      playStation(station);
    }
  }

  onCleanup(() => {
    if (audio()) {
      audio().pause();
    }
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 flex flex-col text-blue-800">
      <h1 class="text-4xl font-bold mb-4 text-center">الراديو العربي</h1>
      <Show when={!currentCountry()}>
        <CountrySelector
          arabCountries={arabCountries}
          selectCountry={selectCountry}
          loading={loading}
        />
      </Show>
      <Show when={currentCountry()}>
        <button
          class="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer self-start"
          onClick={() => {
            setCurrentCountry(null);
            setStations([]);
            setCurrentPlayingStation(null);
            setSelectedStation(null);
            setSelectedStationIndex(null);
            if (audio()) {
              audio().pause();
              audio().currentTime = 0;
              setAudio(null);
            }
          }}
        >
          العودة إلى قائمة الدول
        </button>
        <h2 class="text-2xl font-bold mb-4 text-center">
          محطات الراديو في {currentCountry().name}
        </h2>
        <div class="flex flex-col md:flex-row md:space-x-reverse md:space-x-4 h-full">
          <div class="md:w-1/3">
            <StationList
              filteredStations={filteredStations}
              loading={loading}
              selectedStation={selectedStation}
              setSelectedStation={setSelectedStation}
              setSelectedStationIndex={setSelectedStationIndex}
              playStation={playStation}
              stopStation={stopStation}
              currentPlayingStation={currentPlayingStation}
              selectedStationIndex={selectedStationIndex}
              previousStation={previousStation}
              nextStation={nextStation}
            />
          </div>
          <StationDetails
            loading={loading}
            currentPlayingStation={currentPlayingStation}
          />
        </div>
      </Show>
    </div>
  );
}

export default App;