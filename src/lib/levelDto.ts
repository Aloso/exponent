import type { LevelData } from '../components/GameOptions.svelte'
import type { LevelDto } from './api/types'

export function levelDtoToData(levelDto: LevelDto): LevelData {
	return {
		levelId: levelDto.level_id,
		author: levelDto.author,
		created: levelDto.created,
		votes: levelDto.votes,
		myVote: levelDto.my_vote,
		name: levelDto.name,
		desc: levelDto.desc,
		difficulty: levelDto.difficulty,
	}
}
