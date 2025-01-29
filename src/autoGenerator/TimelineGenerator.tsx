import { useState } from 'react';
import './autoGenerator.css';

interface TimelineGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (timelineText: string) => void;
}

interface Event {
  id: number;
  name: string;
}

interface TimelinePeriod {
    id: number;
    name: string;
    events: Event[];
}

interface Section {
    id: number;
    name: string;
    timelines: TimelinePeriod[];
}

export const TimelineGenerator: React.FC<TimelineGeneratorProps> = ({ isOpen, onClose, onInsert }) => {
  const [sections, setSections] = useState<Section[]>([
    { id: 1, name: 'Section name', timelines: [{ id: 1, name: 'Timeline Period', events: [{ id: 1, name: 'Event Name' }] }] },
  ]);

    const addSection = () => {
        const newSection = {
        id: sections.length + 1,
        name: `Section ${sections.length + 1}`,
        timelines: [{ id: 1, name: 'Timeline name', events: [{ id: 1, name: 'Event Name' }] }]
        };
        setSections([...sections, newSection]);
    };

    const addTimeline = (sectionIndex: number) => {
        const newTimeline = {
        id: sections[sectionIndex].timelines.length + 1,
        name: `Timeline ${sections[sectionIndex].timelines.length + 1}`,
        events: [{ id: 1, name: 'Event Name' }]
        };
        const updatedSections = sections.map((section, i) => {
        if (i === sectionIndex) {
            return { ...section, timelines: [...section.timelines, newTimeline] };
        }
        return section;
        });
        setSections(updatedSections);
    };

    const addEvent = (sectionIndex: number, timelineIndex: number) => {
        const newEvent = {
        id: sections[sectionIndex].timelines[timelineIndex].events.length + 1,
        name: `Event ${sections[sectionIndex].timelines[timelineIndex].events.length + 1}`
        };
        const updatedSections = sections.map((section, i) => {
        if (i === sectionIndex) {
            const updatedTimelines = section.timelines.map((timeline, j) => {
            if (j === timelineIndex) {
                return { ...timeline, events: [...timeline.events, newEvent] };
            }
            return timeline;
            });
            return { ...section, timelines: updatedTimelines };
        }
        return section;
        });
        setSections(updatedSections);
    };

    const updateSection = (index: number, field: keyof Section, value: string) => {
        const updatedSections = sections.map((section, i) => {
        if (i === index) {
            return { ...section, [field]: value };
        }
        return section;
        });
        setSections(updatedSections);
    };

    const updateTimeline = (sectionIndex: number, timelineIndex: number, field: keyof TimelinePeriod, value: string) => {
        const updatedSections = sections.map((section, i) => {
        if (i === sectionIndex) {
            const updatedTimelines = section.timelines.map((timeline, j) => {
            if (j === timelineIndex) {
                return { ...timeline, [field]: value };
            }
            return timeline;
            });
            return { ...section, timelines: updatedTimelines };
        }
        return section;
        });
        setSections(updatedSections);
    };

    const updateEvent = (sectionIndex: number, timelineIndex: number, eventIndex: number, field: keyof Event, value: string) => {
        const updatedSections = sections.map((section, i) => {
        if (i === sectionIndex) {
            const updatedTimelines = section.timelines.map((timeline, j) => {
            if (j === timelineIndex) {
                const updatedEvents = timeline.events.map((event, k) => {
                if (k === eventIndex) {
                    return { ...event, [field]: value };
                }
                return event;
                });
                return { ...timeline, events: updatedEvents };
            }
            return timeline;
            });
            return { ...section, timelines: updatedTimelines };
        }
        return section;
        });
        setSections(updatedSections);
    };

    const removeEvent = (sectionIndex: number, timePeridIndex: number, eventIndex: number) => {
        const section = sections[sectionIndex];
        const timelPeriod = section.timelines[timePeridIndex];
        if (timelPeriod.events.length > 1) {
            const updatedSections = sections.map((sect, i) => {
                if (i === sectionIndex) {
                    const updatedTimelines = sect.timelines.map((timeline, j) => {
                        if (j === timePeridIndex) {
                            const updatedEvents = timeline.events.filter((_, k) => k !== eventIndex);
                            return { ...timeline, events: updatedEvents };
                        }
                        return timeline;
                    });
                    return { ...sect, timelines: updatedTimelines };
                }
                return sect;
            });
            setSections(updatedSections);
        } else {
            alert('You must have at least one event in a timeline');
        }
    }

    const removeSection = (sectionIndex: number) => {
        const updatedSections = sections.filter((_, i) => i !== sectionIndex);
        setSections(updatedSections);
    };

    const removeTimeline = (sectionIndex: number, timelineIndex: number) => {
        const updatedSections = sections.map((section, i) => {
            if (i === sectionIndex) {
                const updatedTimelines = section.timelines.filter((_, j) => j !== timelineIndex);
                return { ...section, timelines: updatedTimelines };
            }
            return section;
        });
        setSections(updatedSections);
    };

    const createTimeline = () => {
        let timeline = '```mermaid\ntimeline\n';
        timeline += '    title Timeline\n';

        sections.forEach((section) => {
        timeline += `    section ${section.name}\n`;

            section.timelines.forEach((TimelinePeriod) => {
                timeline += `        section ${TimelinePeriod.name}\n`;
                TimelinePeriod.events.forEach((event) => {
                    timeline += `            ${event.name} :${event.id}\n`;
                });
            });
        });

        timeline += '```';
        return timeline;
    };

    return isOpen ? (
        <div className='modal-overlay'>
            <div className='time-modal-content'>
                <div className='time-headers-section'>
                    <h2>Mermaid Timeline Generator</h2>
                    <button onClick={onClose}>Close</button>
                </div>
                <div className='time-generator-body'>
                    <div className='time-generator-sections'>
                        {sections.map((section, i) => (
                            <div key={section.id} className='time-generator-section'>
                                <div className='time-layout-container'>
                                    <div className='time-left-column'>
                                        <div className='time-input-stack'>
                                            <input
                                                type='text'
                                                value={section.name}
                                                onChange={(e) => updateSection(i, 'name', e.target.value)}
                                                placeholder='Section name'
                                                className='time-input'
                                            />
                                            <button onClick={() => removeSection(i)}>Remove Section</button>
                                        </div>
                                        {section.timelines.map((TimelinePeriod, j) => (
                                            <div key={TimelinePeriod.id} className='time-input-stack'>
                                                <input
                                                    type='text'
                                                    value={TimelinePeriod.name}
                                                    onChange={(e) => updateTimeline(i, j, 'name', e.target.value)}
                                                    placeholder='Timeline name'
                                                    className='time-input'
                                                />
                                                <button onClick={() => removeTimeline(i, j)}>Remove Timeline</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='time-right-column'>
                                        {section.timelines.map((TimelinePeriod, j) => 
                                            TimelinePeriod.events.map((event, k) => (
                                                <div key={event.id} className='time-event-row'>
                                                    <textarea
                                                        value={event.name}
                                                        onChange={(e) => updateEvent(i, j, k, 'name', e.target.value)}
                                                        placeholder='Event Description'
                                                        className='time-input time-textarea-large'
                                                    />
                                                    <button onClick={() => removeEvent(i, j, k)}>Remove Event</button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='time-generator-buttons'>
                        <button onClick={addSection}>Add Section</button>
                        <button onClick={() => addTimeline(sections.length - 1)}>Add Timeline</button>
                        <button onClick={() => addEvent(sections.length - 1, sections[sections.length - 1]?.timelines.length - 1)}>Add Event</button>
                        <button onClick={() => onInsert(createTimeline())}>Insert Timeline</button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;
};

export default TimelineGenerator;