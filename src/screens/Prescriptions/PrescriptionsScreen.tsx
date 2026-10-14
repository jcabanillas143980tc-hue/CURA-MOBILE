import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius } from '../../constants/colors';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type DoseStatus = 'pending' | 'taken' | 'missed';

type Condition = {
  id: string;
  name: string;
  medication: string;
  prescribedBy: string;
  duration: string;
  refillable: boolean;
  stockStatus: string;
  nextCheckup: string;
  howToTake: string;
  tabletsLeft: number;
  tabletsTotal: number;
  reminderEnabled: boolean;
  doseStatus: DoseStatus;
};

const CONDITIONS: Condition[] = [
  {
    id: 'bp',
    name: 'High Blood Pressure',
    medication: 'Lisinopril 5mg',
    prescribedBy: 'Dr. James Osei',
    duration: '30 days',
    refillable: true,
    stockStatus: 'Good',
    nextCheckup: 'Nov 3, 2026',
    howToTake: 'Take 1 tablet every morning with or without food.',
    tabletsLeft: 18,
    tabletsTotal: 30,
    reminderEnabled: true,
    doseStatus: 'taken',
  },
  {
    id: 'anemia',
    name: 'Iron Deficiency Anemia',
    medication: 'Ferrous Sulfate 325mg',
    prescribedBy: 'Dr. Priya Nair',
    duration: '60 days',
    refillable: true,
    stockStatus: 'Low — refill soon',
    nextCheckup: 'Nov 20, 2026',
    howToTake: 'Take 1 tablet daily with food to reduce stomach upset.',
    tabletsLeft: 6,
    tabletsTotal: 60,
    reminderEnabled: false,
    doseStatus: 'missed',
  },
];

type DayStatus = 'completed' | 'missed' | 'checkup' | 'upcoming' | null;

const MEDICATIONS = ['All Medications', 'Lisinopril 5mg', 'Ferrous Sulfate'];

const MONTH_LABEL = 'March 2026';
const DAYS_IN_MONTH = 31;
const START_WEEKDAY = 0;

const DAY_STATUS: Record<number, DayStatus> = {
  1: 'completed', 2: 'completed', 3: 'completed', 4: 'missed', 5: 'completed',
  6: 'completed', 7: 'completed', 8: 'checkup', 9: 'completed', 10: 'completed',
  11: 'completed', 12: 'missed', 13: 'completed', 14: 'completed', 15: 'checkup',
  16: 'completed', 17: 'completed', 18: 'completed', 19: 'completed', 20: 'completed',
};

const ADHERENCE = { taken: 18, missed: 2, rate: 90, checkups: 2 };
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const STATUS_COLOR: Record<Exclude<DayStatus, null>, string> = {
  completed: colors.green,
  missed: colors.red,
  checkup: colors.blueDark,
  upcoming: colors.muted,
};

export default function PrescriptionsScreen() {
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [calendarMed, setCalendarMed] = useState('All Medications');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [expandedId, setExpandedId] = useState<string | null>(CONDITIONS[0].id);
  const [conditions, setConditions] = useState<Condition[]>(CONDITIONS);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toggleReminder = (id: string) => {
    setConditions((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, reminderEnabled: !c.reminderEnabled } : c
      )
    );
  };

  const markTaken = (id: string) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, doseStatus: 'taken' } : c))
    );
  };

  const openCalendar = (medicationName: string) => {
    setCalendarMed(medicationName);
    setDropdownOpen(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setView('calendar');
  };

  const renderDoseAction = (cond: Condition) => {
    if (cond.doseStatus === 'missed') {
      return (
        <View style={styles.missedBox}>
          <View style={styles.missedPill}>
            <Feather name="x" size={12} color="#fff" />
            <Text style={styles.missedPillText}>Missed</Text>
          </View>
          <Text style={styles.missedNote}>No response — logged as missed</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.takeBtn,
          cond.doseStatus === 'taken' && styles.takeBtnDone,
        ]}
        disabled={cond.doseStatus === 'taken'}
        onPress={() => markTaken(cond.id)}
      >
        <Feather
          name={cond.doseStatus === 'taken' ? 'check-circle' : 'circle'}
          size={16}
          color={cond.doseStatus === 'taken' ? colors.green : colors.blueMid}
        />
        <Text
          style={[
            styles.takeBtnText,
            cond.doseStatus === 'taken' && styles.takeBtnTextDone,
          ]}
        >
          {cond.doseStatus === 'taken' ? 'Taken' : 'Mark as Taken'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (view === 'calendar') {
    const cells: (number | null)[] = [
      ...Array(START_WEEKDAY).fill(null),
      ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
    ];

    return (
      <View style={styles.screen}>
        <View style={styles.gradientHeader}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setView('list');
            }}
            hitSlop={10}
          >
            <Feather name="chevron-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.gradientHeaderTitle}>Medication Calendar</Text>
          <Text style={styles.gradientHeaderSub}>Track adherence & check-ups over time</Text>
        </View>

        <ScrollView contentContainerStyle={styles.bodyPadding}>
          <TouchableOpacity
            style={styles.selector}
            onPress={() => setDropdownOpen((v) => !v)}
            activeOpacity={0.8}
          >
            <Text style={styles.selectorText}>{calendarMed}</Text>
            <Feather name={dropdownOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={styles.dropdown}>
              {MEDICATIONS.map((med) => (
                <TouchableOpacity
                  key={med}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setCalendarMed(med);
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      med === calendarMed && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {med}
                  </Text>
                  {med === calendarMed && (
                    <Feather name="check" size={16} color={colors.blueMid} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.legendRow}>
            <LegendItem color={colors.green} label="Completed" />
            <LegendItem color={colors.red} label="Missed" />
            <LegendItem color={colors.blueDark} label="Check-up" />
            <LegendItem color={colors.muted} label="Upcoming" />
          </View>

          <View style={styles.calendarCard}>
            <Text style={styles.monthLabel}>{MONTH_LABEL}</Text>

            <View style={styles.weekdayRow}>
              {WEEKDAY_LABELS.map((d, i) => (
                <Text key={i} style={styles.weekdayLabel}>{d}</Text>
              ))}
            </View>

            <View style={styles.grid}>
              {cells.map((day, idx) => {
                if (day === null) return <View key={idx} style={styles.cell} />;
                const status = DAY_STATUS[day] ?? null;
                const highlighted = day === 8 || day === 15;

                return (
                  <View key={idx} style={[styles.cell, highlighted && styles.cellHighlighted]}>
                    <Text style={styles.cellText}>{day}</Text>
                    {status && (
                      <View style={[styles.cellDot, { backgroundColor: STATUS_COLOR[status] }]} />
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>{calendarMed} — Adherence</Text>
            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: colors.greenBg }]}>
                <Text style={[styles.statValue, { color: colors.green }]}>{ADHERENCE.taken} days</Text>
                <Text style={styles.statLabel}>Taken</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: colors.redBg }]}>
                <Text style={[styles.statValue, { color: colors.red }]}>{ADHERENCE.missed} days</Text>
                <Text style={styles.statLabel}>Missed</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{ADHERENCE.rate}%</Text>
                <Text style={styles.statLabel}>Adherence Rate</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{ADHERENCE.checkups}</Text>
                <Text style={styles.statLabel}>Check-ups Logged</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.gradientHeader}>
        <Text style={styles.gradientHeaderTitle}>Prescriptions</Text>
        <Text style={styles.gradientHeaderSub}>
          {conditions.length} condition{conditions.length !== 1 ? 's' : ''} managed
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.bodyPadding}>
        {conditions.map((cond) => {
          const expanded = expandedId === cond.id;
          const pct = cond.tabletsLeft / cond.tabletsTotal;

          return (
            <View key={cond.id} style={styles.card}>
              <TouchableOpacity onPress={() => toggleExpand(cond.id)} activeOpacity={0.8}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.conditionName}>{cond.name}</Text>
                    <Text style={styles.medicationName}>{cond.medication}</Text>
                  </View>
                  <Feather
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.muted}
                  />
                </View>

                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
                </View>
                <Text style={styles.tabletsLeftText}>
                  {cond.tabletsLeft} of {cond.tabletsTotal} tablets left
                </Text>
              </TouchableOpacity>

              {expanded && (
                <View style={styles.expandedArea}>
                  <Text style={styles.detailSectionTitle}>Prescribed Medication</Text>
                  <View style={styles.medRow}>
                    <Feather name="box" size={16} color={colors.blueMid} />
                    <Text style={styles.medRowText}>{cond.medication}</Text>
                  </View>

                  <View style={styles.detailGrid}>
                    <View style={styles.detailGridItem}>
                      <Text style={styles.detailLabel}>Prescribed by</Text>
                      <Text style={styles.detailValue}>{cond.prescribedBy}</Text>
                    </View>
                    <View style={styles.detailGridItem}>
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{cond.duration}</Text>
                    </View>
                    <View style={styles.detailGridItem}>
                      <Text style={styles.detailLabel}>Refillable</Text>
                      <Text style={styles.detailValue}>{cond.refillable ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.detailGridItem}>
                      <Text style={styles.detailLabel}>Stock Status</Text>
                      <Text
                        style={[
                          styles.detailValue,
                          cond.stockStatus.startsWith('Low') && { color: colors.amber },
                        ]}
                      >
                        {cond.stockStatus}
                      </Text>
                    </View>
                    <View style={[styles.detailGridItem, styles.detailGridFull]}>
                      <Text style={styles.detailLabel}>Next Check-up</Text>
                      <Text style={styles.detailValue}>{cond.nextCheckup}</Text>
                    </View>
                  </View>

                  <View style={styles.noteBox}>
                    <Feather name="info" size={14} color={colors.blueMid} />
                    <Text style={styles.noteText}>{cond.howToTake}</Text>
                  </View>

                  <View style={styles.doseRow}>
                    <Text style={styles.doseLabel}>Today's Dose</Text>
                    {renderDoseAction(cond)}
                  </View>

                  <View style={styles.reminderRow}>
                    <Text style={styles.reminderLabel}>Daily Reminder</Text>
                    <Switch
                      value={cond.reminderEnabled}
                      onValueChange={() => toggleReminder(cond.id)}
                      trackColor={{ false: colors.border, true: colors.blueLight }}
                      thumbColor={cond.reminderEnabled ? colors.blueMid : '#fff'}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.calendarBtn}
                    onPress={() => openCalendar(cond.medication)}
                  >
                    <Feather name="calendar" size={16} color={colors.blueMid} />
                    <Text style={styles.calendarBtnText}>View Calendar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  bodyPadding: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },

  gradientHeader: {
    backgroundColor: colors.blueMid,
    paddingTop: spacing.xl + spacing.md,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  gradientHeaderTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  gradientHeaderSub: { fontSize: 13, color: '#DFF5F1', marginTop: 4 },
  backCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'flex-start' },
  conditionName: { fontSize: 15, fontWeight: '700', color: colors.ink },
  medicationName: { fontSize: 13, color: colors.muted, marginTop: 2 },

  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  progressFill: { height: '100%', backgroundColor: colors.blueMid, borderRadius: 3 },
  tabletsLeftText: { fontSize: 11, color: colors.muted, marginTop: 4 },

  expandedArea: { marginTop: spacing.md },
  detailSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  medRowText: { fontSize: 13, fontWeight: '600', color: colors.ink },

  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  detailGridItem: {
    width: '47%',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  detailGridFull: { width: '100%' },
  detailLabel: { fontSize: 11, color: colors.muted },
  detailValue: { fontSize: 13, fontWeight: '600', color: colors.ink, marginTop: 2 },

  noteBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.blueLight + '1A',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    alignItems: 'flex-start',
  },
  noteText: { fontSize: 12, color: colors.ink, flex: 1, lineHeight: 17 },

  doseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  doseLabel: { fontSize: 13, fontWeight: '600', color: colors.ink },

  takeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.blueMid,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  takeBtnDone: { borderColor: colors.green, backgroundColor: colors.greenBg },
  takeBtnText: { fontSize: 12, fontWeight: '700', color: colors.blueMid },
  takeBtnTextDone: { color: colors.green },

  missedBox: { alignItems: 'flex-end' },
  missedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.red,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  missedPillText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  missedNote: { fontSize: 10, color: colors.muted, marginTop: 4, textAlign: 'right' },

  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reminderLabel: { fontSize: 13, fontWeight: '600', color: colors.ink },

  calendarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 10,
    marginTop: spacing.sm,
  },
  calendarBtnText: { fontSize: 13, fontWeight: '700', color: colors.blueMid },

  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.xs,
  },
  selectorText: { fontSize: 14, fontWeight: '600', color: colors.ink },

  dropdown: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: { fontSize: 14, color: colors.ink },
  dropdownItemTextSelected: { color: colors.blueMid, fontWeight: '700' },

  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 12, color: colors.muted },

  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  monthLabel: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },

  weekdayRow: { flexDirection: 'row', marginBottom: 4 },
  weekdayLabel: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 11,
    color: colors.muted,
    fontWeight: '600',
  },

  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellHighlighted: {
    backgroundColor: colors.greenBg,
    borderRadius: radius.md,
  },
  cellText: { fontSize: 13, color: colors.ink },
  cellDot: { width: 5, height: 5, borderRadius: 2.5, marginTop: 2 },

  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  statsTitle: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statBox: {
    width: '47%',
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  statValue: { fontSize: 16, fontWeight: '700', color: colors.ink },
  statLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
});