import { describe, expect, it } from "bun:test";
import type { Task } from "../types/index.ts";
import { formatHeading } from "../ui/heading.ts";
import { generateDetailContent } from "../ui/task-viewer-with-search.ts";

const createTask = (overrides: Partial<Task> = {}): Task => ({
	id: "TASK-1",
	title: "Sparse task",
	status: "To Do",
	assignee: [],
	createdDate: "2026-11-11",
	labels: [],
	dependencies: [],
	...overrides,
});

const detailBody = (task: Task) => generateDetailContent(task).bodyContent.join("\n");
const heading = (name: string) => formatHeading(name, 2);

describe("TUI task details", () => {
	it("shows only the sections a task has content for", () => {
		const describedOnly = detailBody(createTask({ description: "Why this matters" }));
		expect(describedOnly).toContain(heading("Description"));
		expect(describedOnly, "empty acceptance criteria").not.toContain(heading("Acceptance Criteria"));
		expect(describedOnly, "empty Definition of Done").not.toContain(heading("Definition of Done"));

		const checklistsOnly = detailBody(
			createTask({
				description: "  ",
				acceptanceCriteriaItems: [{ index: 1, text: "Works", checked: false }],
				definitionOfDoneItems: [{ index: 1, text: "Tested", checked: true }],
			}),
		);
		expect(checklistsOnly, "blank description").not.toContain(heading("Description"));
		expect(checklistsOnly).toContain(heading("Acceptance Criteria"));
		expect(checklistsOnly).toContain(heading("Definition of Done"));
	});
});
