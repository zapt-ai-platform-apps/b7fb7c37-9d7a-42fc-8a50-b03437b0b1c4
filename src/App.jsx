import { createSignal, onMount, For, Show } from 'solid-js';
import { Routes, Route, A } from '@solidjs/router';

function App() {
  const [countries, setCountries] = createSignal([]);
  const [stations, setStations] = createSignal([]);
  const [searchQuery, setSearchQuery] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [currentStation, setCurrentStation] = createSignal(null);
  const [currentCountry, setCurrentCountry] = createSignal(null);

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
    setLoading(true);
    try {
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/bycountry/${encodeURIComponent(countryCode)}`);
      if (response.ok) {
        const data = await response.json();
        setStations(data);
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
    setCurrentStation(null);
    setSearchQuery('');
    fetchStations(country.code);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 p-4 flex flex-col">
      <h1 class="text-4xl font-bold text-blue-800 mb-4 text-center">راديو عربي احترافي</h1>
      <Show when={!currentCountry()}>
        <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">اختر دولة</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <For each={arabCountries}>
            {(country) => (
              <div
                class="p-4 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer text-center"
                onClick={() => selectCountry(country)}
              >
                <p class="text-blue-800 font-semibold">{country.name}</p>
              </div>
            )}
          </For>
        </div>
      </Show>
      <Show when={currentCountry()}>
        <button
          class="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer self-start"
          onClick={() => {
            setCurrentCountry(null);
            setStations([]);
          }}
        >
          العودة إلى قائمة الدول
        </button>
        <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">محطات الراديو في {currentCountry().name}</h2>
        <div class="flex flex-col md:flex-row md:space-x-4">
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
                <p class="text-center text-blue-800">جاري التحميل...</p>
              }
            >
              <div class="max-h-[60vh] overflow-y-auto">
                <For each={filteredStations()}>
                  {(station) => (
                    <div
                      class="p-4 mb-2 bg-white rounded-lg shadow-md hover:bg-blue-100 cursor-pointer"
                      onClick={() => setCurrentStation(station)}
                    >
                      <p class="text-blue-800 font-semibold">{station.name}</p>
                      <p class="text-gray-600 text-sm">{station.country}</p>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </div>
          <div class="md:w-2/3 mt-4 md:mt-0 flex flex-col items-center">
            <Show when={currentStation()}>
              <div class="w-full">
                <h2 class="text-2xl font-bold text-blue-800 mb-4 text-center">{currentStation().name}</h2>
                <audio
                  src={currentStation().url_resolved}
                  controls
                  autoplay
                  class="w-full"
                />
              </div>
            </Show>
            <Show when={!currentStation()}>
              <p class="text-center text-blue-800">اختر محطة من القائمة لتشغيلها</p>
            </Show>
          </div>
        </div>
      </Show>
    </div>
  );
}

export default App;