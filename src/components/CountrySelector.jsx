import { For } from 'solid-js';

function CountrySelector(props) {
  const { arabCountries, selectCountry, loading } = props;

  return (
    <>
      <h2 class="text-2xl font-bold mb-4 text-center">اختر دولة</h2>
      <div class="flex justify-center">
        <select
          class="w-full max-w-md p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent box-border cursor-pointer"
          onChange={(e) => {
            const selectedCode = e.target.value;
            const selectedCountry = arabCountries.find(
              (country) => country.code === selectedCode
            );
            if (selectedCountry) {
              selectCountry(selectedCountry);
            }
          }}
          disabled={loading()}
        >
          <option value="" selected disabled>
            اختر دولة
          </option>
          <For each={arabCountries}>
            {(country) => <option value={country.code}>{country.name}</option>}
          </For>
        </select>
      </div>
    </>
  );
}

export default CountrySelector;