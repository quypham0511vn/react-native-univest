import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";

import { Touchable } from "@/components";
import { KeyValueModel } from "@/models/key-value";
import { COLORS, Styles } from "@/theme";

const FilterTemplate = ({
  item,
  selected,
  onPress,
  style,
}: {
  item: KeyValueModel;
  selected: boolean;
  onPress: any;
  style?: TextStyle;
}) => {
  return (
    <Touchable
      style={selected ? styles.filterSelected : styles.filterUnSelected}
      onPress={onPress}
    >
      <Text
        style={[
          selected ? styles.filterTxtSelected : styles.filterTxtUnSelected,
          style,
        ]}
      >
        {item.name ? item.name : item.label}
      </Text>
    </Touchable>
  );
};

export default FilterTemplate;
const styles = StyleSheet.create({
  filterUnSelected: {
    flex: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: COLORS.GRAY_13,
    alignSelf: "center",
  },
  filterSelected: {
    flex: 1,
    borderRadius: 5,
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 5,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: COLORS.RED,
  },
  filterTxtSelected: {
    ...Styles.typography.medium,
    color: COLORS.RED,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  filterTxtUnSelected: {
    ...Styles.typography.regular,
    color: COLORS.GRAY_6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "center",
  },
});
