import { createSignal, For, Show, onCleanup } from 'solid-js';

function App() {
  const [stations, setStations] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [currentCountry, setCurrentCountry] = createSignal(null);
  const [currentPlayingStation, setCurrentPlayingStation] = createSignal(null);
  const [selectedStation, setSelectedStation] = createSignal(null);
  const [selectedStationIndex, setSelectedStationIndex] = createSignal(null);

  const audioPlayers = new Map();

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
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(countryCode)}`);
      if (response.ok) {
        const data = await response.json();
        // إزالة المحطات المكررة التي تحمل نفس الاسم أو الرابط
        const uniqueStations = data.filter((station, index, self) =>
          index === self.findIndex((s) => (
            s.name === station.name && s.url_resolved === station.url_resolved
          ))
        );
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

  const filteredStations = () => {
    const query = searchQuery().toLowerCase();
    return stations().filter((station) =>
      station.name.toLowerCase().includes(query)
    );
  };

  const selectCountry = (country) => {
    setCurrentCountry(country);
    setCurrentPlayingStation(null);
    setSelectedStation(null);
    setSelectedStationIndex(null);
    setSearchQuery('');
    setStations([]);
    fetchStations(country.code);
  };

  function playStation(station) {
    if (loading()) return;
    // Stop any currently playing audio
    if (currentPlayingStation() && currentPlayingStation().stationuuid !== station.stationuuid) {
      stopStation(currentPlayingStation());
    }

    let audio = audioPlayers.get(station.stationuuid);
    if (!audio) {
      audio = new Audio(station.url_resolved);
      audio.loop = true;
      audioPlayers.set(station.stationuuid, audio);
    }
    audio.play();
    setCurrentPlayingStation(station);
  }

  function stopStation(station) {
    let audio = audioPlayers.get(station.stationuuid);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (currentPlayingStation() && currentPlayingStation().stationuuid === station.stationuuid) {
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

  // تنظيف مشغلات الصوت عند تفريغ المكون
  onCleanup(() => {
    audioPlayers.forEach((audio) => {
      audio.pause();
    });
    audioPlayers.clear();
  });

  return (
    <div class="h-full bg-gradient-to-br from-blue-100 to-blue-300 p-4 flex flex-col text-blue-800">
      <h1 class="text-4xl font-bold mb-4 text-center">الراديو العربي</h1>
      <Show when={!currentCountry()}>
        <h2 class="text-2xl font-bold mb-4 text-center">اختر دولة</h2>
        <div class="flex justify-center">
          <select
            class="w-full max-w-md p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border cursor-pointer"
            onChange={(e) => {
              const selectedCode = e.target.value;
              const selectedCountry = arabCountries.find(country => country.code === selectedCode);
              if (selectedCountry) {
                selectCountry(selectedCountry);
              }
            }}
            disabled={loading()}
          >
            <option value="" selected disabled>اختر دولة</option>
            <For each={arabCountries}>
              {(country) => (
                <option value={country.code}>{country.name}</option>
              )}
            </For>
          </select>
        </div>
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
          }}
        >
          العودة إلى قائمة الدول
        </button>
        <h2 class="text-2xl font-bold mb-4 text-center">محطات الراديو في {currentCountry().name}</h2>
        <div class="flex flex-col md:flex-row md:space-x-reverse md:space-x-4 h-full">
          <div class="md:w-1/3">
            <input
              type="text"
              placeholder="بحث"
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.target.value)}
              class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border"
            />
            <Show
              when={!loading()}
              fallback={
                <p class="text-center">جاري التحميل...</p>
              }
            >
              <select
                class="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border cursor-pointer"
                size="10"
                onChange={(e) => {
                  const selectedStationuuid = e.target.value;
                  const index = filteredStations().findIndex(s => s.stationuuid === selectedStationuuid);
                  if (index !== -1) {
                    setSelectedStation(filteredStations()[index]);
                    setSelectedStationIndex(index);
                  }
                }}
                disabled={loading()}
              >
                <option value="" selected disabled>اختر محطة</option>
                <For each={filteredStations()}>
                  {(station) => (
                    <option value={station.stationuuid}>{station.name}</option>
                  )}
                </For>
              </select>
            </Show>
            <Show when={selectedStation()}>
              <div class="flex flex-col space-y-2">
                <div class="flex space-x-reverse space-x-2">
                  <Show when={!currentPlayingStation() || currentPlayingStation().stationuuid !== selectedStation().stationuuid}>
                    <button
                      class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      onClick={() => playStation(selectedStation())}
                    >
                      تشغيل
                    </button>
                  </Show>
                  <Show when={currentPlayingStation() && currentPlayingStation().stationuuid === selectedStation().stationuuid}>
                    <button
                      class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      onClick={() => stopStation(selectedStation())}
                    >
                      إيقاف
                    </button>
                  </Show>
                </div>
                <div class="flex space-x-reverse space-x-2">
                  <button
                    class={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${selectedStationIndex() === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={previousStation}
                    disabled={selectedStationIndex() === 0}
                  >
                    المحطة السابقة
                  </button>
                  <button
                    class={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${selectedStationIndex() === filteredStations().length -1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={nextStation}
                    disabled={selectedStationIndex() === filteredStations().length -1}
                  >
                    المحطة التالية
                  </button>
                </div>
              </div>
            </Show>
          </div>
          <div class="md:w-2/3 mt-4 md:mt-0 flex flex-col items-center justify-center h-full">
            <Show when={loading()}>
              <p class="text-center">جاري التحميل...</p>
            </Show>
            <Show when={!loading() && currentPlayingStation()}>
              <div class="w-full text-center">
                <h2 class="text-2xl font-bold mb-4">{currentPlayingStation().name}</h2>
                <div class="flex flex-col items-center space-y-4">
                  <Show when={currentPlayingStation().favicon}>
                    <img src={currentPlayingStation().favicon} alt="شعار المحطة" class="w-32 h-32 object-contain" />
                  </Show>
                  <p class="text-lg">الدولة: {currentPlayingStation().country}</p>
                  <p class="text-lg">اللغة: {currentPlayingStation().language}</p>
                  <Show when={currentPlayingStation().bitrate}>
                    <p class="text-lg">معدل البت: {currentPlayingStation().bitrate} kbps</p>
                  </Show>
                  <Show when={currentPlayingStation().tags}>
                    <p class="text-lg">التصنيفات: {currentPlayingStation().tags}</p>
                  </Show>
                  <Show when={currentPlayingStation().clickcount}>
                    <p class="text-lg">عدد مرات التشغيل: {currentPlayingStation().clickcount}</p>
                  </Show>
                </div>
              </div>
            </Show>
            <Show when={!loading() && !currentPlayingStation()}>
              <p class="text-center">اختر محطة من القائمة لتشغيلها</p>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;