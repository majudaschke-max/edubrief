import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { validatePackage } from "../content-loader.mjs";
import { DAY_ROLES, FOUNDATION_PACKAGE_ID } from "../domain.mjs";

const contentDirectory = fileURLToPath(new URL("../content/foundation-weeks/", import.meta.url));
const manifestBytes = await readFile(`${contentDirectory}manifest.json`);
const contentBytes = await readFile(`${contentDirectory}edubrief-foundation-weeks.content.json`);
const manifest = JSON.parse(manifestBytes);
const content = JSON.parse(contentBytes);

const requiredWeekOrder = [
  "Feedback und Überarbeitung",
  "Abrufen / Retrieval Practice",
  "Kognitive Belastung / Cognitive Load",
  "Anleitung und Selbstständigkeit",
  "Tiefe Verarbeitung und Lernhandlungen",
  "Motivation und Selbstbestimmung",
  "Ziele und Selbstregulation",
  "Kooperatives Lernen",
  "Üben, Festigen und Automatisieren",
  "Leistung beurteilen und Noten einordnen",
  "Langeweile und Passung",
  "Klassenführung und Lernzeit",
  "Individualisierung und Adaptivität",
  "Digitale Werkzeuge und Multimedia",
  "Klassenwiederholung",
  "Hausaufgaben als Lernarchitektur",
];

test("published standalone package validates with exact production counts", async () => {
  const validated = await validatePackage(manifest, content, contentBytes);
  assert.equal(validated.manifest.packageId, FOUNDATION_PACKAGE_ID);
  assert.equal(validated.manifest.releaseStatus, "published");
  assert.equal(validated.manifest.publicationStatus, "P3");
  assert.deepEqual(manifest.counts, {
    sources: 528,
    topics: 16,
    themeWeeks: 16,
    cards: 80,
    implementations: 240,
    tombstones: 0,
  });
});

test("all 16 weeks retain their required order and five ordered cards", () => {
  assert.deepEqual(content.themeWeeks.map((week) => week.title), requiredWeekOrder);
  for (const week of content.themeWeeks) {
    assert.equal(week.dayIds.length, 5);
    const cards = content.cards
      .filter((card) => card.themeWeekId === week.weekId)
      .sort((a, b) => a.sequence - b.sequence);
    assert.deepEqual(cards.map((card) => card.id), week.dayIds);
    assert.deepEqual(cards.map((card) => card.sequence), [1, 2, 3, 4, 5]);
    assert.deepEqual(cards.map((card) => card.dayRole), DAY_ROLES);
  }
});

test("all 80 cards retain complete editorial and scientific content", () => {
  assert.equal(content.cards.length, 80);
  for (const card of content.cards) {
    for (const field of ["title", "guidingQuestion", "shortAnswer", "explanation", "takeaway"]) {
      assert.equal(typeof card[field], "string", `${card.id}: ${field}`);
      assert.ok(card[field].length > 0, `${card.id}: ${field}`);
    }
    assert.ok(card.researchStatement.robustCore.length > 0, card.id);
    assert.ok(card.researchStatement.conditionsAndLimits.length > 0, card.id);
    assert.ok(card.researchStatement.doesNotFollow.length > 0, card.id);
    assert.ok(card.researchStatement.sourceRefs.length > 0, card.id);
  }
});

test("all 240 implementation IDs remain stable and unique", () => {
  const implementations = content.cards.flatMap((card) => card.implementations);
  assert.equal(implementations.length, 240);
  assert.equal(new Set(implementations.map((item) => item.implementationId)).size, 240);
  assert.ok(implementations.every((item) => item.reviewStatus === "approved"));
});
