import axios from "axios";

export const searchLocations = async (query) => {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${query}&addressdetails=1&format=json&limit=6&accept-language=en-US`
    );

    let data = res.data;

    /* Remove redundant properties */
    data = data.map(({ lat, lon, display_name, address }) => {
      const {
        amenity,
        building,
        road,
        house_number,
        postcode,
        city,
        town,
        administrative,
        natural,
        place,
        village,
        hamlet,
        county,
        state,
        country,
      } = address;

      let detail = [];
      let region = [];
      let territory = [];

      detail.push(amenity, building, road, house_number);
      region.push(
        postcode,
        city,
        town,
        administrative,
        natural,
        place,
        village,
        hamlet
      );
      territory.push(county, state, country);

      detail = detail.filter((element) => element !== undefined);
      region = region.filter((element) => element !== undefined);
      territory = territory.filter((element) => element !== undefined);

      detail = detail.join(" ");
      region = region.join(" ");
      territory = territory.join(" ");

      const customDisplayName = {
        detail,
        region,
        territory,
      };

      return { lat, lon, display_name, address, customDisplayName };
    });

    /* Remove all duplicates from an array of response */
    data = data.filter(
      (curr, index, self) =>
        index ===
        self.findIndex(
          (location) => location.display_name === curr.display_name
        )
    );

    return data;
  } catch (err) {
    throw new Error(`Error in searchLocations function: ${err}`);
  }
};
